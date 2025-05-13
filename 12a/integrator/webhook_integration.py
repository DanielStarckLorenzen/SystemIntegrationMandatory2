import requests
import json
import uuid
import time
import webbrowser
import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

class WebhookIntegrator:
    def __init__(self, base_url=None, webhook_url=None):
        # Use provided base_url or get from environment variables
        self.base_url = base_url or os.getenv("NGROK_URL")
        if not self.base_url:
            print("No base URL provided. Please provide the ngrok URL when initializing the script.")
            print("Example: python webhook_integration.py https://your-ngrok-url.ngrok.io")
            exit(1)
        
        # Remove trailing slash if present
        self.base_url = self.base_url.rstrip('/')
        
        # Use provided webhook_url or get from environment variables
        self.webhook_url = webhook_url or os.getenv("WEBHOOK_URL")
        if self.webhook_url:
            print(f"Using webhook URL from environment: {self.webhook_url}")
        
        # Secret key for webhook authentication
        self.secret_key = os.getenv("SECRET_KEY") or str(uuid.uuid4())
        print(f"\nUsing secret key: {self.secret_key}")
        
        # Available event types
        self.event_types = [
            "payment_received",
            "payment_processed",
            "invoice_processing",
            "invoice_completed"
        ]
    
    def open_webhook_site(self):
        """Open webhook.site in the default browser and get the URL"""
        # If webhook URL is already set from environment, return it
        if self.webhook_url:
            return self.webhook_url
            
        # Otherwise, open webhook.site and prompt user
        webbrowser.open("https://webhook.site")
        print("\n1. A new tab should have opened with webhook.site")
        print("2. Copy your unique URL from webhook.site")
        self.webhook_url = input("Paste your webhook.site URL here: ")
        print(f"Webhook URL set to: {self.webhook_url}")
        return self.webhook_url
    
    def open_swagger_ui(self):
        """Open the Swagger UI for the API"""
        swagger_url = f"{self.base_url}/swagger"
        webbrowser.open(swagger_url)
        print(f"\nOpened Swagger UI at {swagger_url}")
        return swagger_url
    
    def register_webhook(self, event_type=None):
        """Register a webhook with the API"""
        if not self.webhook_url:
            print("No webhook URL set. Please set WEBHOOK_URL in your .env file or run open_webhook_site() first.")
            return None
        
        # Use event type from environment or let user choose
        event_type = event_type or os.getenv("EVENT_TYPE")
        
        if not event_type:
            print("\nAvailable event types:")
            for i, event in enumerate(self.event_types, 1):
                print(f"{i}. {event}")
            
            while True:
                try:
                    choice = int(input("\nSelect an event type (1-4): "))
                    if 1 <= choice <= len(self.event_types):
                        event_type = self.event_types[choice-1]
                        break
                    else:
                        print("Invalid choice. Please try again.")
                except ValueError:
                    print("Please enter a number.")
        else:
            if event_type not in self.event_types:
                print(f"Warning: {event_type} is not in the list of known event types: {', '.join(self.event_types)}")
        
        print(f"\nRegistering webhook with event type: {event_type}")
        
        # Make the API request to register the webhook
        register_url = f"{self.base_url}/api/webhooks/register"
        payload = {
            "callbackUrl": self.webhook_url,
            "eventType": event_type,
            "secretKey": self.secret_key
        }
        
        try:
            response = requests.post(register_url, json=payload)
            print(f"Response status code: {response.status_code}")
            
            if response.status_code in (200, 201):
                print("Webhook registered successfully!")
                print(json.dumps(response.json(), indent=2))
                return response.json()
            else:
                print("Failed to register webhook:")
                print(json.dumps(response.json(), indent=2))
                return None
        except Exception as e:
            print(f"Error registering webhook: {str(e)}")
            return None
    
    def test_ping(self):
        """Test the webhook connection using the ping endpoint"""
        print("\nTesting webhook connection with ping...")
        ping_url = f"{self.base_url}/api/webhooks/ping"
        
        try:
            response = requests.post(ping_url)
            print(f"Response status code: {response.status_code}")
            
            if response.status_code == 200:
                print("Ping successful!")
                print(json.dumps(response.json(), indent=2))
                print("\nCheck webhook.site to see if you received the notification.")
                return response.json()
            else:
                print("Ping failed:")
                print(json.dumps(response.json(), indent=2))
                return None
        except Exception as e:
            print(f"Error pinging webhook: {str(e)}")
            return None
    
    def create_payment(self):
        """Create a test payment to trigger the webhook"""
        print("\nCreating a test payment...")
        payment_url = f"{self.base_url}/api/payments"
        
        # Example payment payload
        payload = {
            "amount": 100.50,
            "currency": "USD",
            "description": "Test payment via Python script"
        }
        
        try:
            response = requests.post(payment_url, json=payload)
            print(f"Response status code: {response.status_code}")
            
            if response.status_code in (200, 201):
                print("Payment created successfully!")
                print(json.dumps(response.json(), indent=2))
                print("\nCheck webhook.site to see if you received the notification.")
                return response.json()
            else:
                print("Failed to create payment:")
                print(json.dumps(response.json(), indent=2))
                return None
        except Exception as e:
            print(f"Error creating payment: {str(e)}")
            return None
    
    def trigger_event(self, event_type=None):
        """Manually trigger a specific event"""
        event_type = event_type or os.getenv("TRIGGER_EVENT_TYPE")
        
        if not event_type:
            print("\nAvailable event types:")
            for i, event in enumerate(self.event_types, 1):
                print(f"{i}. {event}")
            
            while True:
                try:
                    choice = int(input("\nSelect an event type (1-4): "))
                    if 1 <= choice <= len(self.event_types):
                        event_type = self.event_types[choice-1]
                        break
                    else:
                        print("Invalid choice. Please try again.")
                except ValueError:
                    print("Please enter a number.")
        
        print(f"\nTriggering event: {event_type}")
        trigger_url = f"{self.base_url}/events/{event_type}/trigger"
        
        # Example payload
        payload = {
            "id": str(uuid.uuid4()),
            "amount": 150.75,
            "currency": "USD",
            "timestamp": time.time()
        }
        
        try:
            response = requests.post(trigger_url, json=payload)
            print(f"Response status code: {response.status_code}")
            
            if response.status_code == 200:
                print("Event triggered successfully!")
                print(json.dumps(response.json(), indent=2))
                print("\nCheck webhook.site to see if you received the notification.")
                return response.json()
            else:
                print("Failed to trigger event:")
                print(json.dumps(response.json(), indent=2))
                return None
        except Exception as e:
            print(f"Error triggering event: {str(e)}")
            return None

def main():
    # Check if the base URL is provided as a command line argument
    import sys
    base_url = sys.argv[1] if len(sys.argv) > 1 else None
    
    # Initialize the integrator
    integrator = WebhookIntegrator(base_url)
    
    print("==== Webhook Integration Script ====")
    print(f"Using API at: {integrator.base_url}")
    
    # Step 1: Make sure we have a webhook URL
    if not integrator.webhook_url:
        integrator.open_webhook_site()
    
    # Step 2: Open Swagger UI if AUTO_OPEN environment variable is not set to "false"
    if os.getenv("AUTO_OPEN", "true").lower() != "false":
        integrator.open_swagger_ui()
    
    # Step 3: Register webhook
    integrator.register_webhook()
    
    # Step 4: Test with ping
    integrator.test_ping()
    
    # Step 5: Create a payment or trigger specific event
    test_method = os.getenv("TEST_METHOD", "").lower()
    if test_method == "payment":
        integrator.create_payment()
    elif test_method == "trigger":
        integrator.trigger_event()
    else:
        choice = input("\nWould you like to: \n1. Create a payment event\n2. Trigger a specific event\nEnter your choice (1-2): ")
        if choice == "1":
            integrator.create_payment()
        else:
            integrator.trigger_event()
    
    print("\nIntegration test complete! Check webhook.site for all notifications.")

if __name__ == "__main__":
    main() 