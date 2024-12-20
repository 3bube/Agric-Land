import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  Text,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRental } from "@/utils/rental.utils";
import { useState } from "react";

interface CreateRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: {
    _id: string;
    land: {
      title: string;
      location: string;
      size: number;
      rentalCost: number;
    };
    farmer: {
      name: string;
      email: string;
    };
  };
  onSubmit: (data: {
    inquiryId: string;
    startDate: string;
    endDate: string;
    rentalAmount: number;
    terms: string;
  }) => void;
}

export default function CreateRentalModal({
  isOpen,
  onClose,
  inquiry,
  onSubmit,
}: CreateRentalModalProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rentalAmount, setRentalAmount] = useState(inquiry.land.rentalCost);
  const [terms, setTerms] = useState("");

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
    onError: (error) => {
      toast({
        title: "Error creating rental agreement",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!startDate || !endDate || !rentalAmount || !terms) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date",
        status: "error",
        duration: 3000,
      });
      return;
    }

    onSubmit({
      inquiryId: inquiry._id,
      startDate,
      endDate,
      rentalAmount,
      terms,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>Create Rental Agreement</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            <Text fontWeight="bold" fontSize="lg">
              {inquiry.land.title}
            </Text>
            <Text>
              Farmer: {inquiry.farmer.name} ({inquiry.farmer.email})
            </Text>

            <HStack width="100%" spacing={4}>
              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>
            </HStack>

            <FormControl isRequired>
              <FormLabel>Rental Amount (per month)</FormLabel>
              <NumberInput
                value={rentalAmount}
                onChange={(_, value) => setRentalAmount(value)}
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Terms and Conditions</FormLabel>
              <Textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Enter the terms and conditions of the rental agreement..."
                rows={6}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={createRentalMutation.isLoading}
          >
            Create Agreement
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
