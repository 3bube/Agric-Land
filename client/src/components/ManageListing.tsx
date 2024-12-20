import {
  Box,
  Button,
  SimpleGrid,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useToast,
  Card,
  CardBody,
  Badge,
  HStack,
  VStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Heading,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import {
  MapPin,
  DollarSign,
  Maximize2,
  MoreVertical,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import InputImage from "./uploadImage";
import { useQuery } from "@tanstack/react-query";
import {
  createLand,
  getLandsByOwner,
  changeLandStatus,
  deleteLand,
} from "@/utils/land.utils";
import MapComponent from "./MapComponent";

interface Listing {
  ownerId: number;
  title: string;
  location: string;
  features: string[];
  rentalCost: number;
  size: number;
  status: "available" | "rented" | "under-maintenance";
  imageUrl?: string;
  description?: string;
  image?: any;
  coordinates?: { lat: number; lng: number };
}

export function ManageListings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["lands", user._id],
    queryFn: async () => getLandsByOwner(user._id),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [newListing, setNewListing] = useState<Partial<Listing>>({
    status: "available",
    features: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const FEATURES = [
    "Irrigation System",
    "Rich Soil",
    "Road Access",
    "Water Resources",
    "Flat Terrain",
    "Security",
  ];

  const locationTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (data) {
      setListings(data);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
    };
  }, []);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "green";
      case "rented":
        return "orange";
      case "under-maintenance":
        return "red";
      default:
        return "gray";
    }
  };

  const handleCreateListing = async () => {
    if (
      !newListing.title ||
      !newListing.location ||
      !newListing.rentalCost ||
      !newListing.size ||
      !markerPosition
    ) {
      toast({
        title: "Error",
        description:
          "Please fill in all required fields and select a location on the map",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    const listing: Listing = {
      ownerId: user._id,
      title: newListing.title,
      location: newListing.location,
      rentalCost: newListing.rentalCost,
      size: newListing.size,
      status: newListing.status?.toLowerCase() ?? "available",
      description: newListing.description,
      features: newListing.features,
      image: newListing.image,
      coordinates: markerPosition,
    };

    try {
      await createLand(listing);
      refetch();
      setNewListing({});
      onClose();
      toast({
        title: "Success",
        description: "Listing has been created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create listing",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id: number) => {
    try {
      await deleteLand(id);
      refetch();
      toast({
        title: "Deleted",
        description: "Listing has been removed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleStatusChange = async (
    id: number,
    newStatus: Listing["status"]
  ) => {
    try {
      await changeLandStatus(newStatus, id);
      refetch();
      toast({
        title: "Updated",
        description: "Listing status has been updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLocationSelect = async (location: {
    lat: number;
    lng: number;
  }) => {
    setMarkerPosition(location);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
      );
      const data = await response.json();

      if (data.display_name) {
        setNewListing({
          ...newListing,
          location: data.display_name,
        });
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  const handleLocationInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setNewListing({ ...newListing, location: value });

    // If the user has stopped typing for 1 second, try to geocode the location
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
    }

    locationTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )}`
        );
        const data = await response.json();

        if (data && data[0]) {
          const { lat, lon } = data[0];
          setMarkerPosition({
            lat: parseFloat(lat),
            lng: parseFloat(lon),
          });
        }
      } catch (error) {
        console.error("Error geocoding location:", error);
      }
    }, 1000);
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg">My Listings</Heading>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Create Listing
          </Button>
        </Flex>

        <Flex gap={4} wrap={{ base: "wrap", md: "nowrap" }}>
          <InputGroup maxW={{ base: "100%", md: "320px" }}>
            <InputLeftElement>
              <Search className="h-4 w-4" />
            </InputLeftElement>
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <InputGroup maxW={{ base: "100%", md: "200px" }}>
            <InputLeftElement>
              <Filter className="h-4 w-4" />
            </InputLeftElement>
            <Select
              pl={10}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="under-maintenance">Under Maintenance</option>
            </Select>
          </InputGroup>
        </Flex>

        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {filteredListings.map((listing) => (
              <Card
                key={listing._id}
                bg={bgColor}
                borderColor={borderColor}
                borderWidth={1}
              >
                {listing.image && (
                  <Box h="200px" overflow="hidden">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <Flex justify="space-between" align="start">
                      <Text fontWeight="bold" fontSize="lg">
                        {listing.title}
                      </Text>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<MoreVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            onClick={() =>
                              handleStatusChange(
                                listing._id,
                                "under-maintenance"
                              )
                            }
                          >
                            Mark Under Maintenance
                          </MenuItem>
                          <MenuItem
                            color={"red"}
                            onClick={() => handleDeleteListing(listing._id)}
                          >
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>

                    {listing.features && listing.features.length > 0 && (
                      <HStack wrap="wrap">
                        {listing.features.map((feature) => (
                          <Badge
                            key={feature}
                            colorScheme="blue"
                            variant="subtle"
                            rounded="full"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </HStack>
                    )}

                    <Badge
                      colorScheme={getStatusColor(listing.status)}
                      alignSelf="start"
                    >
                      {listing.status}
                    </Badge>

                    <VStack align="stretch" spacing={2}>
                      <HStack>
                        <MapPin className="h-4 w-4" />
                        <Text>{listing.location}</Text>
                      </HStack>
                      <HStack>
                        <DollarSign className="h-4 w-4" />
                        <Text>
                          ₦{listing.rentalCost?.toLocaleString()}/year
                        </Text>
                      </HStack>
                      <HStack>
                        <Maximize2 className="h-4 w-4" />
                        <Text>{listing.size} acres</Text>
                      </HStack>
                    </VStack>

                    {listing.description && (
                      <Text color="gray.600" noOfLines={2}>
                        {listing.description}
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent maxW="900px">
            <ModalHeader>Create New Listing</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    placeholder="Enter title"
                    value={newListing.title || ""}
                    onChange={(e) =>
                      setNewListing({ ...newListing, title: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    placeholder="Enter location or select on map"
                    value={newListing.location}
                    onChange={handleLocationInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Pin Location on Map</FormLabel>
                  <Box
                    h="300px"
                    borderRadius="md"
                    overflow="hidden"
                    border="1px"
                    borderColor={borderColor}
                  >
                    <MapComponent
                      onSelectLocation={handleLocationSelect}
                      initialLocation={markerPosition}
                    />
                  </Box>
                  {markerPosition && (
                    <Text fontSize="sm" mt={2} color="gray.500">
                      Selected coordinates: {markerPosition.lat.toFixed(6)},{" "}
                      {markerPosition.lng.toFixed(6)}
                    </Text>
                  )}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Rental Cost</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter rental cost"
                    value={newListing.rentalCost || ""}
                    onChange={(e) =>
                      setNewListing({
                        ...newListing,
                        rentalCost: Number(e.target.value),
                      })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Size</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter size"
                    value={newListing.size || ""}
                    onChange={(e) =>
                      setNewListing({
                        ...newListing,
                        size: Number(e.target.value),
                      })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    as="textarea"
                    placeholder="Enter description"
                    value={newListing.description || ""}
                    onChange={(e) =>
                      setNewListing({
                        ...newListing,
                        description: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Features</FormLabel>
                  <HStack wrap="wrap" justify="start">
                    {newListing.features?.map((feature) => (
                      <Badge
                        key={feature}
                        variant="solid"
                        rounded="lg"
                        cursor="pointer"
                        colorScheme="blue"
                        mr={2}
                        mb={2}
                        onClick={() =>
                          setNewListing({
                            ...newListing,
                            features: newListing.features?.filter(
                              (f) => f !== feature
                            ),
                          })
                        }
                      >
                        {feature}
                      </Badge>
                    ))}

                    {FEATURES.filter(
                      (feature) => !newListing.features?.includes(feature)
                    ).map((feature) => (
                      <Badge
                        key={feature}
                        variant="outline"
                        cursor="pointer"
                        rounded="lg"
                        colorScheme="blue"
                        mr={2}
                        mb={2}
                        onClick={() =>
                          setNewListing({
                            ...newListing,
                            features: newListing.features
                              ? [...newListing.features, feature]
                              : [feature],
                          })
                        }
                      >
                        {feature}
                      </Badge>
                    ))}
                  </HStack>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    placeholder="Select status"
                    value={newListing.status || ""}
                    onChange={(e) =>
                      setNewListing({
                        ...newListing,
                        status: e.target.value as Listing["status"],
                      })
                    }
                  >
                    <option value="Available">Available</option>
                    <option value="Rented">Rented</option>
                    <option value="Under-Maintenance">Under Maintenance</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Images</FormLabel>
                  <InputImage
                    setNewListing={setNewListing}
                    newListing={newListing}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={loading}
                colorScheme="blue"
                onClick={handleCreateListing}
              >
                Create Listing
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
