import {
  Box,
  Button,
  SimpleGrid,
  Input,
  Select,
  Stack,
  Text,
  Card,
  CardBody,
  Badge,
  HStack,
  VStack,
  Image,
  Heading,
  InputGroup,
  InputLeftElement,
  Flex,
  useColorModeValue,
  IconButton,
  Tooltip,
  Tag,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Maximize2,
  Filter,
  Heart,
  MessageCircle,
  Info,
} from "lucide-react";

interface Listing {
  id: number;
  title: string;
  location: string;
  price: number;
  size: number;
  imageUrl: string;
  description: string;
  features: string[];
  owner: string;
  rating: number;
}

const mockListings: Listing[] = [
  {
    id: 1,
    title: "Fertile Agricultural Land",
    location: "Lagos State",
    price: 50000,
    size: 10,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    description:
      "Perfect for crop farming with rich soil and good irrigation system.",
    features: ["Irrigation System", "Rich Soil", "Road Access"],
    owner: "John Smith",
    rating: 4.5,
  },
  {
    id: 2,
    title: "Rice Plantation Plot",
    location: "Abuja",
    price: 75000,
    size: 15,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    description: "Ideal for rice cultivation with abundant water resources.",
    features: ["Water Resources", "Flat Terrain", "Security"],
    owner: "Mary Johnson",
    rating: 4.8,
  },
];

export function SearchableListings() {
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleInquiry = (listing: Listing) => {
    setSelectedListing(listing);
    onOpen();
  };

  const handleSendInquiry = () => {
    toast({
      title: "Inquiry Sent",
      description: "Your inquiry has been sent to the land owner.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const handleAddToFavorites = (listingId: number) => {
    toast({
      title: "Added to Favorites",
      description: "This listing has been added to your favorites.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      locationFilter === "all" || listing.location === locationFilter;
    const matchesPriceRange =
      priceRange === "all" ||
      (priceRange === "0-50000" && listing.price <= 50000) ||
      (priceRange === "50000-100000" &&
        listing.price > 50000 &&
        listing.price <= 100000) ||
      (priceRange === "100000+" && listing.price > 100000);

    return matchesSearch && matchesLocation && matchesPriceRange;
  });

  return (
    <Box bg={useColorModeValue("white", "gray.900")} minH="100vh" p={4}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" mb={4}>
          Available Land Listings
        </Heading>

        <Flex gap={4} wrap="wrap">
          <InputGroup maxW="sm">
            <InputLeftElement>
              <Search className="h-4 w-4 text-gray-400" />
            </InputLeftElement>
            <Input
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Select
            maxW="200px"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">All Locations</option>
            <option value="Lagos State">Lagos State</option>
            <option value="Abuja">Abuja</option>
          </Select>

          <Select
            maxW="200px"
            placeholder="Price Range"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="0-50000">₦0 - ₦50,000</option>
            <option value="50000-100000">₦50,000 - ₦100,000</option>
            <option value="100000+">₦100,000+</option>
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
              <Box position="relative">
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  height="200px"
                  width="100%"
                  objectFit="cover"
                />
                <IconButton
                  aria-label="Add to favorites"
                  icon={<Heart className="h-4 w-4" />}
                  position="absolute"
                  top={4}
                  right={4}
                  rounded="full"
                  onClick={() => handleAddToFavorites(listing.id)}
                />
              </Box>

              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Heading size="md" noOfLines={2}>
                    {listing.title}
                  </Heading>

                  <HStack spacing={2} wrap="wrap">
                    {listing.features.map((feature, index) => (
                      <Tag key={index} size="sm" colorScheme="blue">
                        {feature}
                      </Tag>
                    ))}
                  </HStack>

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

                  <Text noOfLines={2} color="gray.600">
                    {listing.description}
                  </Text>

                  <Flex justify="space-between" align="center" mt={2}>
                    <Text fontSize="sm" color="gray.500">
                      Owner: {listing.owner}
                    </Text>
                    <Button
                      leftIcon={<MessageCircle className="h-4 w-4" />}
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleInquiry(listing)}
                    >
                      Inquire
                    </Button>
                  </Flex>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Send Inquiry</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                {selectedListing && (
                  <>
                    <Box w="full">
                      <Text fontWeight="medium" mb={2}>
                        Land Details:
                      </Text>
                      <Text>{selectedListing.title}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {selectedListing.location}
                      </Text>
                    </Box>
                    <Box w="full">
                      <Text fontWeight="medium" mb={2}>
                        Your Message:
                      </Text>
                      <Input
                        as="textarea"
                        placeholder="Type your message to the land owner..."
                        rows={4}
                      />
                    </Box>
                    <Button
                      colorScheme="blue"
                      leftIcon={<MessageCircle className="h-4 w-4" />}
                      onClick={handleSendInquiry}
                      w="full"
                    >
                      Send Inquiry
                    </Button>
                  </>
                )}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
