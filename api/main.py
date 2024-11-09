import requests
import json

FEMA_API_URL = "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"


def get_disaster_data(county, state_code):
    """Query FEMA API for disaster data based on county and state."""
    params = {
        "state": state_code,
        "designatedArea": county,
        "limit": 1  # Limit for testing; adjust as needed
    }
    response = requests.get(FEMA_API_URL, params=params)
    if response.status_code != 200:
        print("Error with FEMA API:", response.json())
        return None

    return response.json()


try:
    disaster_data = get_disaster_data("Collin", "TX")
    if disaster_data is not None:
        with open("data.json", "w") as f:
            json.dump(disaster_data, f, indent=4)  # Indent for readability
            print("Disaster data written to data.json")
except Exception as e:
    print(f"An error occurred: {e}")