import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Flex,
  Heading,
  Text,
  useToast,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Avatar,
  Grid,
  GridItem,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInquiriesForLandOwner,
  updateInquiryStatus,
} from "@/utils/inquiry.utils";
import { createOrGetChat } from "@/utils/chat.utils";
import { createRental } from "@/utils/rental.utils";
import { useState } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import { useChat } from "@/context/ChatContext";
import CreateRentalModal from "@/components/CreateRentalModal";
import { changeLandStatus } from "@/utils/land.utils";
import { format } from "date-fns";

interface Inquiry {
  _id: string;
  farmer: {
    _id: string;
    name: string;
    email: string;
  };
  land: {
    _id: string;
    title: string;
    location: string;
    size: number;
    rentalCost: number;
  };
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export default function LandOwnerInquiries() {
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatPartner, setChatPartner] = useState<{
    _id: string;
    name: string;
  } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");
  const queryClient = useQueryClient();
  const { onlineUsers } = useChat();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ["inquiries", "landowner"],
    queryFn: async () => await getInquiriesForLandOwner(),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      inquiryId,
      status,
      landId,
    }: {
      inquiryId: string;
      status: string;
    }) => updateInquiryStatus(inquiryId, status, landId),
    onSuccess: () => {
      queryClient.invalidateQueries(["inquiries", "landowner"]);
      toast({
        title: "Status Updated",
        description: "The inquiry status has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const createRentalMutation = useMutation({
    mutationFn: (data: {
      inquiryId: string;
      startDate: string;
      endDate: string;
      rentalAmount: number;
      terms: string;
    }) => createRental(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["inquiries"]);
      queryClient.invalidateQueries(["rentals"]);
      toast({
        title: "Rental agreement created",
        description: "The farmer will be notified to review and sign.",
        status: "success",
        duration: 5000,
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error creating rental agreement",
        description: error.response?.data || "Please try again later",
        status: "error",
        duration: 5000,
      });
    },
  });

  const handleStatusUpdate = (
    inquiryId: string,
    status: string,
    landId: string
  ) => {
    updateStatusMutation.mutate({ inquiryId, status, landId });
  };

  const handleViewDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    onOpen();
  };

  const handleStartChat = async (farmerId: string, farmerName: string) => {
    try {
      const chat = await createOrGetChat(farmerId);
      setActiveChatId(chat._id);
      setChatPartner({ _id: farmerId, name: farmerName });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start chat",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAcceptInquiry = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    onOpen();
  };

  const handleCreateRental = async (data: {
    inquiryId: string;
    startDate: string;
    endDate: string;
    rentalAmount: number;
    terms: string;
  }) => {
    try {
      await createRentalMutation.mutateAsync(data);
      // Update inquiry status after rental creation
      await updateStatusMutation.mutateAsync({
        inquiryId: data.inquiryId,
        status: "accepted",
        landId: selectedInquiry.land._id,
      });

      handleStatusUpdate(data.inquiryId, "accepted", selectedInquiry.land._id);
    } catch (error) {
      console.error("Error in rental creation:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  if (inquiries?.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>No inquiries found.</Text>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading inquiries...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.3xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Land Inquiries</Heading>

        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {inquiries?.map((inquiry) => (
            <GridItem key={inquiry._id}>
              <Card>
                <CardHeader>
                  <VStack align="stretch" spacing={2}>
                    <Heading size="md">{inquiry.land.title}</Heading>
                    <HStack justify="space-between">
                      <Badge colorScheme={getStatusColor(inquiry.status)}>
                        {inquiry.status.toUpperCase()}
                      </Badge>
                    </HStack>
                  </VStack>
                </CardHeader>

                <CardBody>
                  <Stack spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Farmer</Text>
                      <Text>{inquiry.farmer.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {inquiry.farmer.email}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontWeight="bold">Message</Text>
                      <Text>{inquiry.message}</Text>
                    </Box>

                    <Box>
                      <Text fontWeight="bold">Submitted</Text>
                      <Text>
                        {format(new Date(inquiry.createdAt), "MMM dd, yyyy")}
                      </Text>
                    </Box>
                  </Stack>
                </CardBody>

                <Divider />

                <CardFooter>
                  <HStack spacing={4} width="100%">
                    {inquiry.status === "pending" && (
                      <>
                        <Button
                          colorScheme="green"
                          flex={1}
                          onClick={() => handleAcceptInquiry(inquiry)}
                        >
                          Agree
                        </Button>
                        <Button
                          colorScheme="red"
                          flex={1}
                          onClick={() =>
                            updateStatusMutation.mutate({
                              inquiryId: inquiry._id,
                              status: "rejected",
                            })
                          }
                          isLoading={updateStatusMutation.isLoading}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      colorScheme="blue"
                      flex={1}
                      onClick={() =>
                        handleStartChat(inquiry.farmer._id, inquiry.farmer.name)
                      }
                    >
                      Chat
                    </Button>
                  </HStack>
                </CardFooter>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </VStack>

      {selectedInquiry && (
        <CreateRentalModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedInquiry(null);
          }}
          inquiry={selectedInquiry}
          onSubmit={handleCreateRental}
        />
      )}

      {/* Chat Window */}
      {activeChatId && chatPartner && (
        <ChatWindow
          chatId={activeChatId}
          recipient={chatPartner}
          onClose={() => {
            setActiveChatId(null);
            setChatPartner(null);
          }}
        />
      )}
    </Container>
  );
}
