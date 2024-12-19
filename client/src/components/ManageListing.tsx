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
import { useEffect, useState } from "react";
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
  const [newListing, setNewListing] = useState<Partial<Listing>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState("all");
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

  useEffect(() => {
    if (data) {
      setListings(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Flex
        direction={"column"}
        alignItems={"center"}
        justify={"center"}
        position={"fixed"}
        top={0}
        bottom={0}
        left={0}
        right={0}
        zIndex={100}
      >
        <Spinner size={{ base: "sm", md: "lg" }} />
        <Text>Loading...</Text>
      </Flex>
    );
  }

  const handleCreateListing = async () => {
    if (
      !newListing.title ||
      !newListing.location ||
      !newListing.rentalCost ||
      !newListing.size
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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
    };

    try {
      await createLand(listing);
      refetch();
      setNewListing({});
      onClose();
      toast({
        title: "Success",
        description: "Listing created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
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
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
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
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update listing status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredListings = listings?.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "green";
      case "rented":
        return "blue";
      case "under-maintenance":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Box bg={useColorModeValue("white", "gray.900")}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg">Manage Listings</Heading>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Add New Listing
          </Button>
        </Flex>

        <Flex gap={4} wrap="wrap">
          <InputGroup maxW="sm">
            <InputLeftElement>
              <Search className="h-4 w-4 text-gray-400" />
            </InputLeftElement>
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Select
            maxW="200px"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            icon={<Filter className="h-4 w-4 text-gray-400" />}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="under-maintenance">Under Maintenance</option>
          </Select>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredListings?.map((listing) => (
            <Card
              key={listing._id}
              bg={bgColor}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
              transition="all 0.2s"
              _hover={{ shadow: "lg" }}
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
                    <Heading size="md" noOfLines={2}>
                      {listing.title}
                    </Heading>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<MoreVertical className="h-4 w-4" />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          onClick={() =>
                            handleStatusChange(listing._id, "available")
                          }
                        >
                          Mark Available
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleStatusChange(listing._id, "rented")
                          }
                        >
                          Mark Rented
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleStatusChange(listing._id, "under-maintenance")
                          }
                        >
                          Mark Under Maintenance
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={() => handleDeleteListing(listing._id)}
                          color="red.500"
                        >
                          Delete Listing
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>

                  {listing.features.length > 0 && (
                    <HStack spacing={2}>
                      {listing.features.map((feature) => (
                        <Badge
                          key={feature}
                          colorScheme="green"
                          rounded="lg"
                          variant="solid"
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
                      <Text>₦{listing.rentalCost?.toLocaleString()}/year</Text>
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

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Listing</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    placeholder="Enter listing title"
                    value={newListing.title || ""}
                    onChange={(e) =>
                      setNewListing({ ...newListing, title: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    placeholder="Enter location"
                    value={newListing.location || ""}
                    onChange={(e) =>
                      setNewListing({ ...newListing, location: e.target.value })
                    }
                  />
                </FormControl>
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Price (₦/year)</FormLabel>
                    <Input
                      type="number"
                      placeholder="Enter price"
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
                    <FormLabel>Size (acres)</FormLabel>
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
                </SimpleGrid>
                <FormControl>
                  <FormLabel>Features</FormLabel>
                  <HStack wrap="wrap" justify="start">
                    {newListing.features?.map((feature) => (
                      <Badge
                        key={feature}
                        variant="solid"
                        rounded="lg"
                        cursor={"pointer"}
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
              </Stack>
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
