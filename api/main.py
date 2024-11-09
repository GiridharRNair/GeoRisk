from fastapi import FastAPI, HTTPException
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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
    return risk_data(lat, lon)