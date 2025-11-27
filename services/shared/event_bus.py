"""
Event bus for asynchronous inter-service communication.

This module provides event publishing and subscription capabilities
for microservices to communicate asynchronously.
"""

import os
import json
from typing import Dict, Any, Callable, Optional
from datetime import datetime
import pika
from pika.exceptions import AMQPConnectionError

# RabbitMQ connection settings
RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
EXCHANGE_NAME = os.getenv("EVENT_EXCHANGE", "viruj_events")


class EventBus:
    """Event bus for publishing and subscribing to events."""
    
    def __init__(self):
        self.connection: Optional[pika.BlockingConnection] = None
        self.channel: Optional[pika.channel.Channel] = None
        self._connect()
    
    def _connect(self):
        """Establish connection to RabbitMQ."""
        try:
            params = pika.URLParameters(RABBITMQ_URL)
            self.connection = pika.BlockingConnection(params)
            self.channel = self.connection.channel()
            self.channel.exchange_declare(
                exchange=EXCHANGE_NAME,
                exchange_type='topic',
                durable=True
            )
        except AMQPConnectionError as e:
            print(f"Warning: RabbitMQ connection failed: {e}. Event bus disabled.")
            self.connection = None
            self.channel = None
    
    def publish(self, event_type: str, data: Dict[str, Any], routing_key: Optional[str] = None):
        """
        Publish an event.
        
        Args:
            event_type: Type of event (e.g., "batch.status.changed")
            data: Event data
            routing_key: Optional routing key (defaults to event_type)
        """
        if not self.channel:
            print("Event bus not available, skipping event publish")
            return
        
        event = {
            "event_type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "data": data
        }
        
        routing_key = routing_key or event_type
        message = json.dumps(event)
        
        try:
            self.channel.basic_publish(
                exchange=EXCHANGE_NAME,
                routing_key=routing_key,
                body=message,
                properties=pika.BasicProperties(
                    delivery_mode=2,  # Make message persistent
                )
            )
        except Exception as e:
            print(f"Error publishing event: {e}")
    
    def subscribe(self, event_pattern: str, callback: Callable):
        """
        Subscribe to events matching a pattern.
        
        Args:
            event_pattern: Event pattern (e.g., "batch.*" or "quality.#")
            callback: Function to call when event is received
        """
        if not self.channel:
            print("Event bus not available, cannot subscribe")
            return
        
        # Create queue
        queue_name = f"{event_pattern.replace('*', 'all').replace('#', 'all')}_queue"
        result = self.channel.queue_declare(queue=queue_name, durable=True)
        queue_name = result.method.queue
        
        # Bind queue to exchange
        self.channel.queue_bind(
            exchange=EXCHANGE_NAME,
            queue=queue_name,
            routing_key=event_pattern
        )
        
        # Set up consumer
        def on_message(ch, method, properties, body):
            try:
                event = json.loads(body)
                callback(event)
                ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as e:
                print(f"Error processing event: {e}")
                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
        
        self.channel.basic_consume(
            queue=queue_name,
            on_message_callback=on_message
        )
    
    def close(self):
        """Close connection."""
        if self.connection and not self.connection.is_closed:
            self.connection.close()


# Global event bus instance
_event_bus: Optional[EventBus] = None


def get_event_bus() -> EventBus:
    """Get or create event bus instance."""
    global _event_bus
    if _event_bus is None:
        _event_bus = EventBus()
    return _event_bus


def publish_event(event_type: str, data: Dict[str, Any], routing_key: Optional[str] = None):
    """Publish an event (convenience function)."""
    bus = get_event_bus()
    bus.publish(event_type, data, routing_key)

