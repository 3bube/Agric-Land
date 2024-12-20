import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRentals,
  signRental,
  updateRentalStatus,
  updatePaymentStatus,
} from "@/utils/rental.utils";
import { ChevronDown as ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface Rental {
  _id: string;
  land: {
    _id: string;
    title: string;
    location: string;
    size: number;
    rentalCost: number;
  };
  farmer: {
    _id: string;
    name: string;
    email: string;
  };
  landowner: {
    _id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  rentalAmount: number;
  paymentStatus: "pending" | "paid" | "overdue";
  status: "active" | "completed" | "terminated";
  terms: string;
  signedByFarmer: boolean;
  signedByLandowner: boolean;
  createdAt: string;
}

export default function Agreements() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const { data: rentals, isLoading } = useQuery({
    queryKey: ["rentals"],
    queryFn: async () => await getRentals(),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const signAgreementMutation = useMutation({
    mutationFn: (rentalId: string) => signRental(rentalId),
    onSuccess: () => {
      queryClient.invalidateQueries(["rentals"]);
      toast({
        title: "Agreement signed successfully",
        status: "success",
        duration: 3000,
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ rentalId, status }: { rentalId: string; status: string }) =>
      updateRentalStatus(rentalId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["rentals"]);
      toast({
        title: "Status updated successfully",
        status: "success",
        duration: 3000,
      });
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({
      rentalId,
      paymentStatus,
    }: {
      rentalId: string;
      paymentStatus: string;
    }) => updatePaymentStatus(rentalId, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries(["rentals"]);
      toast({
        title: "Payment status updated successfully",
        status: "success",
        duration: 3000,
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "completed":
        return "blue";
      case "terminated":
        return "red";
      default:
        return "gray";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "green";
      case "pending":
        return "yellow";
      case "overdue":
        return "red";
      default:
        return "gray";
    }
  };

  if (rentals?.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>No agreements found.</Text>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading agreements...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Rental Agreements</Heading>

        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {rentals?.map((rental: Rental) => (
            <GridItem key={rental._id}>
              <Card>
                <CardHeader>
                  <VStack align="stretch" spacing={2}>
                    <Heading size="md">{rental.land.title}</Heading>
                    <HStack justify="space-between">
                      <Badge colorScheme={getStatusColor(rental.status)}>
                        {rental.status.toUpperCase()}
                      </Badge>
                      <Badge
                        colorScheme={getPaymentStatusColor(
                          rental.paymentStatus
                        )}
                      >
                        {rental.paymentStatus.toUpperCase()}
                      </Badge>
                    </HStack>
                  </VStack>
                </CardHeader>

                <CardBody>
                  <Stack spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Period</Text>
                      <Text>
                        {format(new Date(rental.startDate), "MMM dd, yyyy")} -{" "}
                        {format(new Date(rental.endDate), "MMM dd, yyyy")}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontWeight="bold">
                        {user.role === "farmer" ? "Landowner" : "Farmer"}
                      </Text>
                      <Text>
                        {user.role === "farmer"
                          ? rental.landowner.name
                          : rental.farmer.name}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontWeight="bold">Rental Amount</Text>
                      <Text>${rental.rentalAmount}</Text>
                    </Box>

                    <Box>
                      <Text fontWeight="bold">Signatures</Text>
                      <HStack>
                        <Badge
                          colorScheme={
                            rental.signedByLandowner ? "green" : "gray"
                          }
                        >
                          Landowner
                        </Badge>
                        <Badge
                          colorScheme={rental.signedByFarmer ? "green" : "gray"}
                        >
                          Farmer
                        </Badge>
                      </HStack>
                    </Box>
                  </Stack>
                </CardBody>

                <Divider />

                <CardFooter>
                  <HStack spacing={4} width="100%">
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        setSelectedRental(rental);
                        onOpen();
                      }}
                      flex={1}
                    >
                      View Details
                    </Button>

                    {user.role === "farmer" && !rental.signedByFarmer && (
                      <Button
                        colorScheme="green"
                        onClick={() => signAgreementMutation.mutate(rental._id)}
                        isLoading={signAgreementMutation.isLoading}
                        flex={1}
                      >
                        Sign Agreement
                      </Button>
                    )}

                    {user.role === "landowner" &&
                      rental.status === "active" && (
                        <Button
                          colorScheme="orange"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              rentalId: rental._id,
                              status: "completed",
                            })
                          }
                          isLoading={updateStatusMutation.isLoading}
                          flex={1}
                        >
                          Complete
                        </Button>
                      )}
                  </HStack>
                </CardFooter>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </VStack>

      {/* Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agreement Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedRental && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Property
                  </Text>
                  <Text>{selectedRental.land.title}</Text>
                  <Text color="gray.600">{selectedRental.land.location}</Text>
                  <Text color="gray.600">
                    {selectedRental.land.size} hectares
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Rental Period
                  </Text>
                  <Text>
                    {format(new Date(selectedRental.startDate), "MMM dd, yyyy")}{" "}
                    - {format(new Date(selectedRental.endDate), "MMM dd, yyyy")}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Parties
                  </Text>
                  <Text>Landowner: {selectedRental.landowner.name}</Text>
                  <Text>Farmer: {selectedRental.farmer.name}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Financial Details
                  </Text>
                  <Text>
                    Rental Amount: ₦
                    {selectedRental.rentalAmount.toLocaleString()}
                  </Text>
                  <HStack spacing={2} mt={2}>
                    <Badge
                      colorScheme={getPaymentStatusColor(
                        selectedRental.paymentStatus
                      )}
                    >
                      {selectedRental.paymentStatus.toUpperCase()}
                    </Badge>
                    {user.role === "landowner" && (
                      <Menu>
                        <MenuButton
                          as={Button}
                          size="sm"
                          variant="outline"
                          rightIcon={<ChevronDownIcon />}
                        >
                          Update Payment
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            onClick={() =>
                              updatePaymentStatusMutation.mutate({
                                rentalId: selectedRental._id,
                                paymentStatus: "paid",
                              })
                            }
                            isDisabled={selectedRental.paymentStatus === "paid"}
                          >
                            Mark as Paid
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              updatePaymentStatusMutation.mutate({
                                rentalId: selectedRental._id,
                                paymentStatus: "pending",
                              })
                            }
                            isDisabled={
                              selectedRental.paymentStatus === "pending"
                            }
                          >
                            Mark as Pending
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              updatePaymentStatusMutation.mutate({
                                rentalId: selectedRental._id,
                                paymentStatus: "overdue",
                              })
                            }
                            isDisabled={
                              selectedRental.paymentStatus === "overdue"
                            }
                          >
                            Mark as Overdue
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </HStack>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Agreement Status
                  </Text>
                  <HStack>
                    <Badge colorScheme={getStatusColor(selectedRental.status)}>
                      {selectedRental.status.toUpperCase()}
                    </Badge>
                    <Badge
                      colorScheme={
                        selectedRental.signedByLandowner ? "green" : "gray"
                      }
                    >
                      Landowner{" "}
                      {selectedRental.signedByLandowner
                        ? "Signed"
                        : "Not Signed"}
                    </Badge>
                    <Badge
                      colorScheme={
                        selectedRental.signedByFarmer ? "green" : "gray"
                      }
                    >
                      Farmer{" "}
                      {selectedRental.signedByFarmer ? "Signed" : "Not Signed"}
                    </Badge>
                  </HStack>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Terms and Conditions
                  </Text>
                  <Text whiteSpace="pre-wrap">{selectedRental.terms}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    Created On
                  </Text>
                  <Text>
                    {format(
                      new Date(selectedRental.createdAt),
                      "MMMM dd, yyyy"
                    )}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
