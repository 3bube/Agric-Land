import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
  Text,
  Flex,
  Input,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import { MoreVertical, Send, Filter, Search } from "lucide-react";
import { useState } from "react";

interface Inquiry {
  id: string;
  landTitle: string;
  farmerName: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  message: string;
}

const mockInquiries: Inquiry[] = [
  {
    id: "1",
    landTitle: "Fertile Farmland in Lagos",
    farmerName: "John Doe",
    date: "2023-12-18",
    status: "pending",
    message: "I'm interested in leasing this land for crop farming.",
  },
  {
    id: "2",
    landTitle: "Rice Field in Abuja",
    farmerName: "Jane Smith",
    date: "2023-12-17",
    status: "approved",
    message: "Looking to expand my rice farming operation.",
  },
  {
    id: "3",
    landTitle: "Vegetable Farm Plot",
    farmerName: "Mike Johnson",
    date: "2023-12-16",
    status: "rejected",
    message: "Interested in organic vegetable farming.",
  },
];

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");

  const handleStatusChange = (inquiryId: string, newStatus: "approved" | "rejected") => {
    setInquiries((prev) =>
      prev.map((inquiry) =>
        inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
      )
    );
    toast({
      title: `Inquiry ${newStatus}`,
      description: `The inquiry has been ${newStatus}.`,
      status: newStatus === "approved" ? "success" : "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleReply = () => {
    toast({
      title: "Reply Sent",
      description: "Your response has been sent to the farmer.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus = filterStatus === "all" || inquiry.status === filterStatus;
    const matchesSearch =
      inquiry.landTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "yellow";
    }
  };

  return (
    <Box bg={bgColor} p={4} rounded="lg" shadow="base">
      <Flex justify="space-between" mb={6} gap={4} flexWrap="wrap">
        <HStack spacing={4} flex={1}>
          <Box flex={1} maxW="sm">
            <Input
              placeholder="Search by land or farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftElement={<Search className="ml-3 h-4 w-4 text-gray-400" />}
            />
          </Box>
          <Box>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              leftElement={<Filter className="ml-3 h-4 w-4 text-gray-400" />}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </Box>
        </HStack>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Land Title</Th>
              <Th>Farmer</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredInquiries.map((inquiry) => (
              <Tr key={inquiry.id}>
                <Td>{inquiry.landTitle}</Td>
                <Td>{inquiry.farmerName}</Td>
                <Td>{new Date(inquiry.date).toLocaleDateString()}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(inquiry.status)}>
                    {inquiry.status}
                  </Badge>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<MoreVertical className="h-4 w-4" />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<Send className="h-4 w-4" />}
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          onOpen();
                        }}
                      >
                        Reply
                      </MenuItem>
                      {inquiry.status === "pending" && (
                        <>
                          <MenuItem
                            onClick={() => handleStatusChange(inquiry.id, "approved")}
                          >
                            Approve
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleStatusChange(inquiry.id, "rejected")}
                          >
                            Reject
                          </MenuItem>
                        </>
                      )}
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reply to Inquiry</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box w="full">
                <Text fontWeight="medium" mb={2}>
                  Original Message:
                </Text>
                <Text color="gray.600">{selectedInquiry?.message}</Text>
              </Box>
              <Box w="full">
                <Text fontWeight="medium" mb={2}>
                  Your Reply:
                </Text>
                <Textarea placeholder="Type your response..." rows={4} />
              </Box>
              <Button
                colorScheme="blue"
                leftIcon={<Send className="h-4 w-4" />}
                onClick={handleReply}
                alignSelf="flex-end"
              >
                Send Reply
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
