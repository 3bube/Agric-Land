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
  useToast,
  Textarea,
  Modal,
  ModalOverlay,
  Spinner,
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
  Heart,
  MessageCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAvailableLands } from "@/utils/land.utils";
import { addFavorite } from "@/utils/favorites.utils";
import { createInquiry } from "@/utils/inquiry.utils";

interface Listing {
  _id: string;
  title: string;
  location: string;
  rentalCost: number;
  size: number;
  image: string;
  description: string;
  features: string[];
  ownerId: {
    _id: string;
    name: string;
  };
  status: string;
  createdAt: string;
}

export function SearchableListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const {
    data: lands,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["available-lands", "available"],
    queryFn: () => getAvailableLands("available"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const handleInquiry = (listing: Listing) => {
    setSelectedListing(listing);
    onOpen();
  };

  const handleSendInquiry = async (landId: number) => {
    try {
      const data = await createInquiry({
        farmer: user._id,
        land: landId,
        message: inquiryMessage,
      });
      if (data) {
        toast({
          title: "Inquiry Sent",
          description: "Your inquiry has been sent to the land owner.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to send inquiry",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddToFavorites = async (listingId: number) => {
    console.log(listingId);
    try {
      const data = await addFavorite(user._id, listingId);

      if (data) {
        toast({
          title: "Added to Favorites",
          description: "This listing has been added to your favorites.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const filteredListings =
    lands?.filter((listing: Listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        locationFilter === "all" || listing.location === locationFilter;
      const matchesPriceRange =
        priceRange === "all" ||
        (priceRange === "0-50000" && listing.rentalCost <= 50000) ||
        (priceRange === "50000-100000" &&
          listing.rentalCost > 50000 &&
          listing.rentalCost <= 100000) ||
        (priceRange === "100000+" && listing.rentalCost > 100000);

      return matchesSearch && matchesLocation && matchesPriceRange;
    }) ?? [];

  // Get unique locations for the filter
  const locations = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
      >
        <Text color="red.500">
          Error loading listings. Please try again later.
        </Text>
      </Box>
    );
  }

  return (
    <Box bg={useColorModeValue("white", "gray.900")}>
      <VStack spacing={6} align="stretch" p={4}>
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
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
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
          {filteredListings.map((listing: Listing) => (
            <Card
              key={listing._id}
              overflow="hidden"
              variant="outline"
              borderColor={borderColor}
            >
              <Image
                src={
                  listing.image ??
                  "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                }
                alt={listing.title}
                height="200px"
                objectFit="cover"
              />
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Heading size="md">{listing.title}</Heading>
                  <HStack>
                    <MapPin className="h-4 w-4" />
                    <Text>{listing.location}</Text>
                  </HStack>
                  <HStack>
                    <DollarSign className="h-4 w-4" />
                    <Text>₦{listing.rentalCost?.toLocaleString()}</Text>
                    <Maximize2 className="h-4 w-4" />
                    <Text>{listing.size} hectares</Text>
                  </HStack>
                  <Text noOfLines={2}>{listing.description}</Text>
                  <HStack>
                    {listing.features?.map((feature, index) => (
                      <Badge key={index} colorScheme="blue" rounded={"full"}>
                        {feature}
                      </Badge>
                    ))}
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    Owner: {listing.ownerId.name}
                  </Text>
                  <HStack justify="space-between">
                    <Button
                      leftIcon={<MessageCircle className="h-4 w-4" />}
                      colorScheme="blue"
                      onClick={() => handleInquiry(listing)}
                    >
                      Inquire
                    </Button>
                    <IconButton
                      aria-label="Add to favorites"
                      icon={<Heart className="h-4 w-4" />}
                      variant="ghost"
                      onClick={() => handleAddToFavorites(listing._id)}
                    />
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {filteredListings.length === 0 && (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500">
              No listings found matching your criteria
            </Text>
          </Box>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Send Inquiry</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Text>
                  Send an inquiry about{" "}
                  <Text as="span" fontWeight="bold">
                    {selectedListing?.title}
                  </Text>
                </Text>
                <Textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Enter your inquiry message here"
                  size="sm"
                  resize="none"
                />
                <Button
                  colorScheme="green"
                  onClick={() => handleSendInquiry(selectedListing?._id)}
                >
                  Send Inquiry
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
