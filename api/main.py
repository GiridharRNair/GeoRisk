from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_json(data):
    cleaned_data = {}
    
    nris_data = data.get("nris", [{}])[0] 

    cleaned_data["state"] = nris_data.get("state")
    cleaned_data["county"] = nris_data.get("county")
    cleaned_data["population"] = nris_data.get("population")
    
    social_vulnerability = nris_data.get("socialVulnerability", {})
    cleaned_data["socialVulnerability"] = social_vulnerability.get("score")

    community_resilience = nris_data.get("communityResilience", {})
    cleaned_data["communityResilience"] = community_resilience.get("score")

    hazard_types = [
        "avalanche", "coastalFlooding", "coldWave", "drought", "earthquake",
        "hail", "heatWave", "hurricane", "iceStorm", "landslide", "lightning",
        "riverineFlooding", "strongWind", "tornado", "tsunami", "volcanicActivity",
        "wildfire", "winterWeather"
    ]
    
    for hazard in hazard_types:
        hazard_info = nris_data.get(hazard, {})
        cleaned_data[hazard] = {
            "events": hazard_info.get("events"),
            "annualizedFrequency": hazard_info.get("annualizedFrequency"),
            "annualLoss": hazard_info.get("annualLoss", {}).get("total"),
            "hazardTypeRiskScore": hazard_info.get("hazardTypeRiskIndex", {}).get("score"),
        }

    return cleaned_data

def risk_data(lat: float, lon: float):
    try:
        response = requests.get(
            f"https://api.lightboxre.com/v1/riskindexes/us/geometry?wkt=POINT%28{lon}%20{lat}%29&bufferDistance=50&bufferUnit=m",
            headers={"x-api-key": os.getenv("LIGHTBOX_APIKEY")}
        )
        response.raise_for_status()  
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/risk")
def get_risk(lat: float, lon: float):
    data = risk_data(lat, lon)
    cleaned_data = clean_json(data)
    return cleaned_data
