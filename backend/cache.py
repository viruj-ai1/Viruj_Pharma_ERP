"""
Caching utilities using Redis.

This module provides caching functionality to improve API performance
by reducing database load and response times.
"""

import json
import hashlib
from typing import Optional, Any, Callable
from functools import wraps
import redis
import os

# Redis connection
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client: Optional[redis.Redis] = None


def get_redis_client() -> redis.Redis:
    """Get or create Redis client."""
    global redis_client
    if redis_client is None:
        try:
            redis_client = redis.from_url(
                REDIS_URL,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True,
            )
            # Test connection
            redis_client.ping()
        except (redis.ConnectionError, redis.TimeoutError) as e:
            print(f"Warning: Redis connection failed: {e}. Caching disabled.")
            return None
    return redis_client


def cache_key(prefix: str, *args, **kwargs) -> str:
    """Generate cache key from prefix and arguments."""
    key_data = f"{prefix}:{str(args)}:{str(sorted(kwargs.items()))}"
    key_hash = hashlib.md5(key_data.encode()).hexdigest()
    return f"{prefix}:{key_hash}"


def cached(ttl: int = 300, key_prefix: str = "cache"):
    """
    Decorator to cache function results (works with both sync and async functions).
    
    Args:
        ttl: Time to live in seconds (default: 5 minutes)
        key_prefix: Prefix for cache keys
    """
    def decorator(func: Callable) -> Callable:
        import inspect
        is_async = inspect.iscoroutinefunction(func)
        
        if is_async:
            @wraps(func)
            async def async_wrapper(*args, **kwargs):
                client = get_redis_client()
                if client is None:
                    return await func(*args, **kwargs)
                
                # Generate cache key
                key = cache_key(key_prefix, func.__name__, *args, **kwargs)
                
                # Try to get from cache
                try:
                    cached_value = client.get(key)
                    if cached_value:
                        return json.loads(cached_value)
                except Exception as e:
                    print(f"Cache read error: {e}")
                
                # Execute function
                result = await func(*args, **kwargs)
                
                # Store in cache
                try:
                    client.setex(key, ttl, json.dumps(result, default=str))
                except Exception as e:
                    print(f"Cache write error: {e}")
                
                return result
            return async_wrapper
        else:
            @wraps(func)
            def sync_wrapper(*args, **kwargs):
                client = get_redis_client()
                if client is None:
                    return func(*args, **kwargs)
                
                # Generate cache key
                key = cache_key(key_prefix, func.__name__, *args, **kwargs)
                
                # Try to get from cache
                try:
                    cached_value = client.get(key)
                    if cached_value:
                        return json.loads(cached_value)
                except Exception as e:
                    print(f"Cache read error: {e}")
                
                # Execute function
                result = func(*args, **kwargs)
                
                # Store in cache
                try:
                    client.setex(key, ttl, json.dumps(result, default=str))
                except Exception as e:
                    print(f"Cache write error: {e}")
                
                return result
            return sync_wrapper
    return decorator


def invalidate_cache(pattern: str) -> int:
    """
    Invalidate cache entries matching pattern.
    
    Args:
        pattern: Redis key pattern (e.g., "user:*")
        
    Returns:
        Number of keys deleted
    """
    client = get_redis_client()
    if client is None:
        return 0
    
    try:
        keys = client.keys(pattern)
        if keys:
            return client.delete(*keys)
        return 0
    except Exception as e:
        print(f"Cache invalidation error: {e}")
        return 0


def clear_cache() -> bool:
    """Clear all cache entries."""
    client = get_redis_client()
    if client is None:
        return False
    
    try:
        client.flushdb()
        return True
    except Exception as e:
        print(f"Cache clear error: {e}")
        return False

