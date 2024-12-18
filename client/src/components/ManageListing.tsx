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
} from "@chakra-ui/react";
import { useState } from "react";
import {
  MapPin,
  DollarSign,
  Maximize2,
  MoreVertical,
  Plus,
  Search,
  Filter,
} from "lucide-react";

interface Listing {
  id: number;
  title: string;
  location: string;
  price: number;
  size: number;
  status: "Available" | "Rented" | "Under Maintenance";
  imageUrl?: string;
  description?: string;
}

const initialListings: Listing[] = [
  {
    id: 1,
    title: "Fertile Farmland",
    location: "Lagos State",
    price: 50000,
    size: 10,
    status: "Available",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    description: "Perfect for crop farming with rich soil and good irrigation.",
  },
  {
    id: 2,
    title: "Rice Plantation",
    location: "Abuja",
    price: 75000,
    size: 15,
    status: "Rented",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    description: "Ideal for rice cultivation with water resources.",
  },
];

export function ManageListings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [newListing, setNewListing] = useState<Partial<Listing>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleCreateListing = () => {
    if (
      !newListing.title ||
      !newListing.location ||
      !newListing.price ||
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

    const listing: Listing = {
      id: listings.length + 1,
      title: newListing.title,
      location: newListing.location,
      price: newListing.price,
      size: newListing.size,
      status: newListing.status || "Available",
      description: newListing.description,
    };

    setListings([...listings, listing]);
    setNewListing({});
    onClose();
    toast({
      title: "Success",
      description: "Listing created successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteListing = (id: number) => {
    setListings(listings.filter((listing) => listing.id !== id));
    toast({
      title: "Deleted",
      description: "Listing has been removed",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleStatusChange = (id: number, newStatus: Listing["status"]) => {
    setListings(
      listings.map((listing) =>
        listing.id === id ? { ...listing, status: newStatus } : listing
      )
    );
    toast({
      title: "Updated",
      description: "Listing status has been updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "green";
      case "Rented":
        return "blue";
      case "Under Maintenance":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Box bg={useColorModeValue("white", "gray.900")} minH="100vh" p={4}>
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
            leftElement={<Filter className="ml-3 h-4 w-4 text-gray-400" />}
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </Select>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              bg={bgColor}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
              transition="all 0.2s"
              _hover={{ shadow: "lg" }}
            >
              {listing.imageUrl && (
                <Box h="200px" overflow="hidden">
                  <img
                    src={listing.imageUrl}
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
                            handleStatusChange(listing.id, "Available")
                          }
                        >
                          Mark Available
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleStatusChange(listing.id, "Rented")
                          }
                        >
                          Mark Rented
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleStatusChange(listing.id, "Under Maintenance")
                          }
                        >
                          Mark Under Maintenance
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={() => handleDeleteListing(listing.id)}
                          color="red.500"
                        >
                          Delete Listing
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>

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
                      <Text>₦{listing.price.toLocaleString()}/year</Text>
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
                      value={newListing.price || ""}
                      onChange={(e) =>
                        setNewListing({
                          ...newListing,
                          price: Number(e.target.value),
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
                    <option value="Under Maintenance">Under Maintenance</option>
                  </Select>
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleCreateListing}>
                Create Listing
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
