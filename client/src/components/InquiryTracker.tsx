import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { getInquiresForFarmer } from "@/utils/inquiry.utils";
import { useQuery } from "@tanstack/react-query";

interface Inquiry {
  id: number;
  listingTitle: string;
  landowner: string;
  status: "Pending" | "Approved" | "Rejected";
  response?: string;
}

const mockInquiries: Inquiry[] = [
  {
    id: 1,
    listingTitle: "Fertile Farmland",
    landowner: "John Doe",
    status: "Pending",
  },
  {
    id: 2,
    listingTitle: "Orchard Paradise",
    landowner: "Jane Smith",
    status: "Approved",
    response:
      "Your request has been approved. Please contact me to discuss details.",
  },
  {
    id: 3,
    listingTitle: "Grazing Fields",
    landowner: "Bob Johnson",
    status: "Rejected",
    response: "Sorry, the land is no longer available.",
  },
];

export function InquiryTracker() {
  const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ["inquiries", "farmer"],
    queryFn: () => getInquiresForFarmer(user._id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (inquiries?.length === 0) {
    return (
      <Box className="space-y-6">
        <Heading as="h2" size="lg" fontWeight="bold">
          No inquiries found
        </Heading>
      </Box>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box className="space-y-6">
      <Heading as="h2" size="lg" fontWeight="bold">
        Your Inquiries
      </Heading>
      {inquiries?.map((inquiry) => (
        <Card key={inquiry._id} variant="outline">
          <CardHeader>
            <Heading as="h5" size="sm">
              {inquiry.land?.title}
            </Heading>
            <Text color={useColorModeValue("gray.600", "gray.400")}>
              Landowner: {inquiry.land?.ownerId.name}
            </Text>
          </CardHeader>
          <CardBody>
            <Text color={useColorModeValue("gray.600", "gray.400")} mb={2}>
              Inquiry: {inquiry?.message}
            </Text>

            <Flex justify="space-between" align="center">
              <Button
                variant={
                  inquiry.status === "pending"
                    ? "outline"
                    : inquiry.status === "accepted"
                    ? "solid"
                    : "ghost"
                }
                colorScheme={
                  inquiry.status === "pending"
                    ? "blue"
                    : inquiry.status === "accepted"
                    ? "green"
                    : "red"
                }
              >
                {inquiry?.status}
              </Button>
              {inquiry.response && (
                <Text color={useColorModeValue("gray.600", "gray.400")}>
                  {inquiry.response}
                </Text>
              )}
            </Flex>
          </CardBody>
        </Card>
      ))}
    </Box>
  );
}
