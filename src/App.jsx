import { Box, Text } from "@chakra-ui/react";
import Map from "react-map-gl";
import GeocoderControl from "@/components/geocoder-control";
import { useState } from "react";

const mapBoxAPIKey = import.meta.env.VITE_MAP_BOX_API_KEY;

function App() {
    const [coordinates, setCoordinates] = useState({
        latitude: 43.6568,
        longitude: -79.4512,
    });

    const handleMapChange = (e) => {
        setCoordinates({
            latitude: e.viewState.latitude,
            longitude: e.viewState.longitude,
        });
    };

    return (
        <>
            <Box height="100vh" width="100vw" zIndex={0} position="relative">
                <Map
                    initialViewState={{
                        longitude: coordinates.longitude,
                        latitude: coordinates.latitude,
                        zoom: 13,
                    }}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                    mapboxAccessToken={mapBoxAPIKey}
                    onMove={handleMapChange} // Trigger state update when map moves
                    // onMoveEnd={handleMapChange}
                >
                    <GeocoderControl mapboxAccessToken={mapBoxAPIKey} position="top-left" />
                </Map>

                {/* Box to display latitude and longitude */}
                <Box
                    position="absolute"
                    top="10px"
                    right="10px"
                    backgroundColor="rgba(0, 0, 0, 0.5)"
                    color="white"
                    padding="10px"
                    borderRadius="8px"
                    zIndex={1}
                >
                    <Text>Latitude: {coordinates.latitude.toFixed(4)}</Text>
                    <Text>Longitude: {coordinates.longitude.toFixed(4)}</Text>
                </Box>
            </Box>
        </>
    );
}

export default App;
