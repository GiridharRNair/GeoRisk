import { useState } from "react";
import { Box, Text, Grid, Separator, VStack, HStack } from "@chakra-ui/react";
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "@/components/ui/accordion";
import { CloseButton } from "@/components/ui/close-button";
import { Badge } from "@chakra-ui/react";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { ProgressCircleRing, ProgressCircleRoot, ProgressCircleValueText } from "@/components/ui/progress-circle";
import Map from "react-map-gl";
import GeocoderControl from "@/components/geocoder-control";
import { Users } from "lucide-react";

const mapBoxAPIKey = import.meta.env.VITE_MAP_BOX_API_KEY;
const backendURL = import.meta.env.VITE_BACKEND_API_URL;

function App() {
    const [coordinates, setCoordinates] = useState({
        latitude: 43.6568,
        longitude: -79.4512,
    });
    const [riskData, setRiskData] = useState(null);
    const [showRiskData, setShowRiskData] = useState(false);
    const [openItems, setOpenItems] = useState(new Set());

    const getHighestRisks = (data) => {
        if (!data) return [];
        return Object.entries(data)
            .filter(
                ([key, value]) =>
                    value &&
                    value.hazardTypeRiskScore !== null &&
                    !["state", "county", "population", "socialVulnerability", "communityResilience"].includes(key),
            )
            .sort((a, b) => b[1].hazardTypeRiskScore - a[1].hazardTypeRiskScore)
            .slice(0, 3);
    };

    const formatRiskName = (name) => {
        return name.replace(/([A-Z])/g, " $1").trim();
    };

    const handleMapMove = (e) => {
        setCoordinates({
            latitude: e.viewState.latitude,
            longitude: e.viewState.longitude,
        });
    };

    const handleMapChange = (e) => {
        const newCoordinates = {
            latitude: e.viewState.latitude,
            longitude: e.viewState.longitude,
        };
        setCoordinates(newCoordinates);
        fetchRiskData(newCoordinates.latitude, newCoordinates.longitude);
    };

    const fetchRiskData = async (lat, lon) => {
        try {
            const response = await fetch(`${backendURL}/api/risk?lat=${lat}&lon=${lon}`);
            const data = await response.json();
            setRiskData(data);
            setShowRiskData(true);
        } catch (error) {
            console.error("Error fetching risk data:", error);
        }
    };

    // Handle accordion toggling
    const toggleAccordion = (key) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(key)) {
            newOpenItems.delete(key);
        } else {
            newOpenItems.add(key);
        }
        setOpenItems(newOpenItems);
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
                    mapStyle="mapbox://styles/mapbox/navigation-night-v1"
                    mapboxAccessToken={mapBoxAPIKey}
                    onMove={handleMapMove}
                    onMoveEnd={handleMapChange}
                    dragPan={false}
                    scrollZoom={false}
                >
                    <GeocoderControl mapboxAccessToken={mapBoxAPIKey} position="top-left" />
                </Map>

                <Box position="absolute" top="10px" right="10px" backgroundColor="rgba(0, 0, 0, 0.5)" padding="10px" borderRadius="8px" zIndex={1}>
                    <DataListRoot orientation={"horizontal"} colorPalette={"pink"}>
                        <DataListItem label={"Latitude"} value={coordinates.latitude.toFixed(4)} />
                        <DataListItem label={"Longitude"} value={coordinates.longitude.toFixed(4)} />
                    </DataListRoot>
                </Box>
            </Box>

            {showRiskData && riskData && (
                <Box
                    position="fixed"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg="gray.900"
                    color="white"
                    p={6}
                    borderRadius="lg"
                    zIndex={1}
                    width="90%"
                    maxWidth="800px"
                    maxHeight="90vh"
                    boxShadow="dark-lg"
                    backdropFilter="blur(8px)"
                    backgroundColor="rgba(23, 25, 35, 0.95)"
                >
                    <CloseButton onClick={() => setShowRiskData(false)} position="absolute" top={4} right={4} />

                    <VStack spacing={6}>
                        <Box textAlign="center" pb={3}>
                            <Text fontSize="3xl" fontWeight="bold" mb={2}>
                                {riskData.county}, {riskData.state}
                            </Text>
                            <Text color="gray.400">Risk Assessment Dashboard</Text>
                        </Box>

                        <Grid templateColumns="repeat(3, 1fr)" gap={6} width="full" pb={4}>
                            <VStack spacing={2}>
                                <Box position="relative">
                                    <Users size={24} color="#63B3ED" />
                                </Box>
                                <Text color="gray.400" fontSize="sm">
                                    Population
                                </Text>
                                <Text fontSize="xl" fontWeight="semibold">
                                    {riskData.population?.toLocaleString()}
                                </Text>
                            </VStack>

                            <VStack>
                                <Box position="relative">
                                    <ProgressCircleRoot value={riskData.socialVulnerability} size={"xl"}>
                                        <ProgressCircleRing color={`hsl(${((riskData.socialVulnerability / 100) * 120)?.toFixed(2)}, 100%, 50%)`} />
                                        <ProgressCircleValueText />
                                    </ProgressCircleRoot>
                                </Box>
                                <Text color="gray.400" fontSize="sm">
                                    Social Vulnerability
                                </Text>
                            </VStack>

                            <VStack>
                                <Box position="relative">
                                    <ProgressCircleRoot value={riskData.communityResilience} size={"xl"}>
                                        <ProgressCircleRing color={`hsl(${((riskData.communityResilience / 100) * 120)?.toFixed(2)}, 100%, 50%)`} />
                                        <ProgressCircleValueText />
                                    </ProgressCircleRoot>
                                </Box>
                                <Text color="gray.400" fontSize="sm">
                                    Community Resilience
                                </Text>
                            </VStack>
                        </Grid>

                        <Separator />

                        <Box width="full" py={5}>
                            <Text fontSize="xl" fontWeight="semibold" mb={3}>
                                Top Hazard Risks
                            </Text>
                            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                                {getHighestRisks(riskData).map(([key, value]) => (
                                    <VStack key={key} p={4} borderRadius="lg" bg="gray.800" spacing={2}>
                                        <ProgressCircleRoot value={value.hazardTypeRiskScore} size={"xl"}>
                                            <ProgressCircleRing color={`hsl(${((100 - value.hazardTypeRiskScore / 100) * 120)?.toFixed(2)}, 100%, 50%)`} />
                                            <ProgressCircleValueText />
                                        </ProgressCircleRoot>
                                        <Text fontSize="sm" textAlign="center">
                                            {formatRiskName(key)}
                                        </Text>
                                    </VStack>
                                ))}
                            </Grid>
                        </Box>

                        <Separator />

                        <Box width="full" py={5}>
                            <Text fontSize="xl" fontWeight="semibold" mb={3}>
                                Detailed Risk Analysis
                            </Text>
                            <Box overflowY="auto" maxHeight="300px" pr={4}>
                                <AccordionRoot type="single" collapsible>
                                    {Object.entries(riskData).map(([key, value]) => {
                                        if (["state", "county", "population", "socialVulnerability", "communityResilience"].includes(key)) {
                                            return null;
                                        }
                                        if (!value || value.hazardTypeRiskScore === null) {
                                            return null;
                                        }
                                        return (
                                            <AccordionItem key={key} value={key} borderBottomWidth="1px" borderColor="gray.700">
                                                <AccordionItemTrigger onClick={() => toggleAccordion(key)} py={4}>
                                                    <HStack justify="space-between" width="full">
                                                        <Text>{formatRiskName(key)}</Text>
                                                        <Badge
                                                            variant="subtle"
                                                            colorScheme={
                                                                value.hazardTypeRiskScore > 50 ? "red" : value.hazardTypeRiskScore > 25 ? "yellow" : "green"
                                                            }
                                                        >
                                                            {value.hazardTypeRiskScore?.toFixed(1)}
                                                        </Badge>
                                                    </HStack>
                                                </AccordionItemTrigger>
                                                <AccordionItemContent pb={4}>
                                                    <VStack spacing={2} align="stretch" fontSize="sm">
                                                        <HStack justify="space-between">
                                                            <Text color="gray.400">Annual Events:</Text>
                                                            <Text>{value.events || 0}</Text>
                                                        </HStack>
                                                        <HStack justify="space-between">
                                                            <Text color="gray.400">Annual Frequency:</Text>
                                                            <Text>{value.annualizedFrequency?.toFixed(2) || 0}</Text>
                                                        </HStack>
                                                        <HStack justify="space-between">
                                                            <Text color="gray.400">Annual Loss ($):</Text>
                                                            <Text>
                                                                {value.annualLoss?.toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }) || 0}
                                                            </Text>
                                                        </HStack>
                                                    </VStack>
                                                </AccordionItemContent>
                                            </AccordionItem>
                                        );
                                    })}
                                </AccordionRoot>
                            </Box>
                        </Box>
                    </VStack>
                </Box>
            )}
        </>
    );
}

export default App;

/**
 * {
  "state": "Texas",
  "county": "Collin",
  "population": 5598,
  "socialVulnerability": 22.33,
  "communityResilience": 53.48,
  "avalanche": {
    "events": null,
    "annualizedFrequency": null,
    "annualLoss": null,
    "hazardTypeRiskScore": null
  },
  "coastalFlooding": {
    "events": null,
    "annualizedFrequency": null,
    "annualLoss": null,
    "hazardTypeRiskScore": null
  },
  "coldWave": {
    "events": 0,
    "annualizedFrequency": 0,
    "annualLoss": 0,
    "hazardTypeRiskScore": 0
  },
  "drought": {
    "events": 651,
    "annualizedFrequency": 36.17,
    "annualLoss": 59.28,
    "hazardTypeRiskScore": 0.71
  },
  "earthquake": {
    "events": null,
    "annualizedFrequency": 0,
    "annualLoss": 4210.44,
    "hazardTypeRiskScore": 5.06
  },
  "hail": {
    "events": 293,
    "annualizedFrequency": 9.16,
    "annualLoss": 421818.09,
    "hazardTypeRiskScore": 34.52
  },
  "heatWave": {
    "events": 9,
    "annualizedFrequency": 0.74,
    "annualLoss": 6402.29,
    "hazardTypeRiskScore": 12.87
  },
  "hurricane": {
    "events": 0,
    "annualizedFrequency": 0.01,
    "annualLoss": 306.73,
    "hazardTypeRiskScore": 2.5
  },
  "iceStorm": {
    "events": 85,
    "annualizedFrequency": 1.27,
    "annualLoss": 5599.91,
    "hazardTypeRiskScore": 13.42
  },
  "landslide": {
    "events": 0,
    "annualizedFrequency": 0.01,
    "annualLoss": 0,
    "hazardTypeRiskScore": 0
  },
  "lightning": {
    "events": 2309,
    "annualizedFrequency": 104.94,
    "annualLoss": 3757.71,
    "hazardTypeRiskScore": 13.63
  },
  "riverineFlooding": {
    "events": 56,
    "annualizedFrequency": 2.33,
    "annualLoss": 43491.66,
    "hazardTypeRiskScore": 10.02
  },
  "strongWind": {
    "events": 152,
    "annualizedFrequency": 4.75,
    "annualLoss": 13288.07,
    "hazardTypeRiskScore": 17.54
  },
  "tornado": {
    "events": 0,
    "annualizedFrequency": 0,
    "annualLoss": 919201.86,
    "hazardTypeRiskScore": 55.1
  },
  "tsunami": {
    "events": null,
    "annualizedFrequency": null,
    "annualLoss": null,
    "hazardTypeRiskScore": null
  },
  "volcanicActivity": {
    "events": null,
    "annualizedFrequency": null,
    "annualLoss": null,
    "hazardTypeRiskScore": null
  },
  "wildfire": {
    "events": null,
    "annualizedFrequency": 0,
    "annualLoss": 0,
    "hazardTypeRiskScore": 0
  },
  "winterWeather": {
    "events": 16,
    "annualizedFrequency": 1.32,
    "annualLoss": 522.05,
    "hazardTypeRiskScore": 5.24
  }
}
 */
