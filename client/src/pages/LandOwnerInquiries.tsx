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
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInquiriesForLandOwner,
  updateInquiryStatus,
} from "@/utils/inquiry.utils";
import { createOrGetChat } from "@/utils/chat.utils";
import { useState } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import { useChat } from "@/context/ChatContext";

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
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
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
    queryKey: ["inquiries", "landowner", user._id],
    queryFn: async () => await getInquiriesForLandOwner(user._id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      inquiryId,
      status,
    }: {
      inquiryId: string;
      status: string;
    }) => updateInquiryStatus(inquiryId, status),
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

  const handleStatusUpdate = (inquiryId: string, status: string) => {
    updateStatusMutation.mutate({ inquiryId, status });
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

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading inquiries...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Land Inquiries</Heading>
      <Flex flexWrap="wrap" gap={4}>
        {inquiries?.map((inquiry: Inquiry) => (
          <Card key={inquiry._id} maxW="sm" flex="1">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading size="md">{inquiry.land.title}</Heading>
                  <Text fontSize="sm" color="gray.500">
                    From: {inquiry.farmer.name}
                  </Text>
                </Box>
                <Badge colorScheme={getStatusColor(inquiry.status)}>
                  {inquiry.status.charAt(0).toUpperCase() +
                    inquiry.status.slice(1)}
                </Badge>
              </Flex>
            </CardHeader>

            <CardBody>
              <Text noOfLines={3}>{inquiry.message}</Text>
              <HStack mt={4} spacing={4}>
                <Text fontWeight="bold">Size:</Text>
                <Text>{inquiry.land.size} acres</Text>
                <Text fontWeight="bold">Price:</Text>
                <Text>₦{inquiry.land.rentalCost?.toLocaleString()}/month</Text>
              </HStack>
            </CardBody>

            <CardFooter justify="space-between" flexWrap="wrap" gap={2}>
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={() => handleViewDetails(inquiry)}
              >
                View Details
              </Button>
              <HStack>
                {inquiry.status === "pending" && (
                  <>
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(inquiry._id, "accepted")
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(inquiry._id, "rejected")
                      }
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() =>
                    handleStartChat(inquiry.farmer._id, inquiry.farmer.name)
                  }
                >
                  Chat
                </Button>
              </HStack>
            </CardFooter>
          </Card>
        ))}
      </Flex>

      {/* Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Inquiry Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedInquiry && (
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Heading size="md">{selectedInquiry.land.title}</Heading>
                  <Text color="gray.500">{selectedInquiry.land.location}</Text>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Farmer Information
                  </Heading>
                  <HStack>
                    <Avatar name={selectedInquiry.farmer.name} size="sm" />
                    <Box>
                      <Text fontWeight="bold">
                        {selectedInquiry.farmer.name}
                      </Text>
                      <Text fontSize="sm">{selectedInquiry.farmer.email}</Text>
                      <Badge
                        colorScheme={
                          onlineUsers.includes(selectedInquiry.farmer._id)
                            ? "green"
                            : "gray"
                        }
                        mt={1}
                      >
                        {onlineUsers.includes(selectedInquiry.farmer._id)
                          ? "Online"
                          : "Offline"}
                      </Badge>
                    </Box>
                  </HStack>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Message
                  </Heading>
                  <Text>{selectedInquiry.message}</Text>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Property Details
                  </Heading>
                  <Text>Size: {selectedInquiry.land.size} acres</Text>
                  <Text>
                    Price: ₦{selectedInquiry.land.rentalCost?.toLocaleString()}
                    /month
                  </Text>
                  <Text>Location: {selectedInquiry.land.location}</Text>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Status
                  </Heading>
                  <Badge colorScheme={getStatusColor(selectedInquiry.status)}>
                    {selectedInquiry.status.charAt(0).toUpperCase() +
                      selectedInquiry.status.slice(1)}
                  </Badge>
                </Box>

                <Text fontSize="sm" color="gray.500">
                  Received:{" "}
                  {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                </Text>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

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
