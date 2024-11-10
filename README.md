DevPost: https://devpost.com/software/riskradar-3jhsft

## Inspiration

Many home buyers and land developers overlook the risks of a property's location when making a purchase. This is often because assessing risk can be complicated, as it requires analyzing weather data, historical records, and other factors. GeoRisk simplifies this process, making it easier to evaluate the potential risks of a property.

## What it does

GeoRisk provides risk data for properties, including details on natural hazards like droughts, hail, and tornadoes. It shows event frequency, potential losses, and risk scores to help users assess property risks.

## How we built it

The frontend is built with React.js and Chakra UI, using Mapbox for an animated, interactive map with geocoding features.

The backend is powered by Python and FastAPI, connecting to Lightbox's risk index API to fetch natural disaster risk data.

Both the frontend and backend are deployed on Vercel, with the backend running as a serverless function.

## Challenges we ran into

Finding an API that provides disaster risk data was a major challenge. Many APIs required contacting sales for a quote or had expensive subscription fees, making it difficult to access the necessary information.

## Accomplishments that we're proud of

We're proud of finding an API that provided the geographic natural disaster data we needed. We’re also happy with how seamlessly we integrated Vercel's deployment features for both the frontend and backend, even with a monorepo structure.

## What we learned

We learned how to develop and ship software quickly under time pressure, as a hackathon also involves preparing a write-up and presentation alongside coding.

## What's next for GeoRisk

We plan to expand GeoRisk to work internationally, as it currently only supports U.S. locations.