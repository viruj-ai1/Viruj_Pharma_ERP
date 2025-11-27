"""Event bus for production service."""

import os
import json
from typing import Dict, Any
from datetime import datetime
import pika

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
EXCHANGE_NAME = os.getenv("EVENT_EXCHANGE", "viruj_events")


def publish_event(event_type: str, data: Dict[str, Any], routing_key: str = None):
    """Publish an event to the event bus."""
    try:
        params = pika.URLParameters(RABBITMQ_URL)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        
        channel.exchange_declare(
            exchange=EXCHANGE_NAME,
            exchange_type='topic',
            durable=True
        )
        
        event = {
            "event_type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "data": data
        }
        
        routing_key = routing_key or event_type
        message = json.dumps(event)
        
        channel.basic_publish(
            exchange=EXCHANGE_NAME,
            routing_key=routing_key,
            body=message,
            properties=pika.BasicProperties(delivery_mode=2)
        )
        
        connection.close()
    except Exception as e:
        print(f"Error publishing event: {e}")

