import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFavorites, removeFavorite } from "@/utils/favorites.utils";
import { useState } from "react";

interface Land {
  _id: string;
  title: string;
  location: string;
  size: number;
  rentalCost: number;
  description: string;
  image: string;
  features: string[];
  status: string;
}

interface Favorite {
  _id: string;
  user: string;
  land: Land;
  createdAt: string;
}

export function FavoritesSection() {
  const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");
  const [selectedListing, setSelectedListing] = useState<Land | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    data: favorites,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["favorites", user._id],
    queryFn: () => getFavorites(user._id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user._id,
  });

  console.log(favorites);

  const handleDelete = async (landId: string) => {
    try {
      await removeFavorite(user._id, landId);
      toast({
        title: "Success",
        description: "Favorite removed successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove favorite",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleViewDetails = (land: Land) => {
    setSelectedListing(land);
    onOpen();
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Text color="red.500">Error loading favorites</Text>
      </Box>
    );
  }

  if (!favorites.length) {
    return (
      <Box>
        <Heading size="lg" mb={4}>
          My Favorites
        </Heading>
        <Text textAlign="center" color="gray.500">
          No favorites added yet
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={4}>
        My Favorites
      </Heading>
      <Flex flexWrap="wrap" gap={4}>
        {favorites?.map(({ land: favorite }) => (
          <Card key={favorite?._id} maxW="sm">
            <CardHeader>
              <Heading size="md">{favorite?.title}</Heading>
              <Text fontSize="sm">{favorite?.location}</Text>
            </CardHeader>
            <CardBody>
              <Text>Size: {favorite?.size} acres</Text>
              <Text>
                Price: ₦{favorite?.rentalCost?.toLocaleString()}/month
              </Text>
            </CardBody>
            <CardFooter justifyContent="space-between" alignItems="center">
              <Button
                variant="link"
                onClick={() => handleViewDetails(favorite)}
              >
                View Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(favorite._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Details for {selectedListing?.title}</Text>
            <Box mt={4}>
              <Text fontWeight="bold">Location:</Text>
              <Text>{selectedListing?.location}</Text>

              <Text fontWeight="bold" mt={2}>
                Size:
              </Text>
              <Text>{selectedListing?.size} acres</Text>

              <Text fontWeight="bold" mt={2}>
                Price:
              </Text>
              <Text>
                ₦{selectedListing?.rentalCost?.toLocaleString()}/month
              </Text>

              {selectedListing?.description && (
                <>
                  <Text fontWeight="bold" mt={2}>
                    Description:
                  </Text>
                  <Text>{selectedListing?.description}</Text>
                </>
              )}

              {selectedListing?.features?.length > 0 && (
                <>
                  <Text fontWeight="bold" mt={2}>
                    Features:
                  </Text>
                  {selectedListing?.features?.map((feature) => (
                    <Badge key={feature} colorScheme="green" mr={2}>
                      {feature}
                    </Badge>
                  ))}
                </>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
