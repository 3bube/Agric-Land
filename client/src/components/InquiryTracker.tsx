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
  useColorModeValue,
} from "@chakra-ui/react";

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
  return (
    <Box className="space-y-6">
      <Heading as="h2" size="lg" fontWeight="bold">
        Your Inquiries
      </Heading>
      {mockInquiries.map((inquiry) => (
        <Card key={inquiry.id} variant="outline">
          <CardHeader>
            <Heading as="h5" size="sm">
              {inquiry.listingTitle}
            </Heading>
            <Text color={useColorModeValue("gray.600", "gray.400")}>
              Landowner: {inquiry.landowner}
            </Text>
          </CardHeader>
          <CardBody>
            <Flex justify="space-between" align="center">
              <Button
                variant={
                  inquiry.status === "Pending"
                    ? "outline"
                    : inquiry.status === "Approved"
                    ? "solid"
                    : "ghost"
                }
                colorScheme={
                  inquiry.status === "Pending"
                    ? "blue"
                    : inquiry.status === "Approved"
                    ? "green"
                    : "red"
                }
              >
                {inquiry.status}
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
