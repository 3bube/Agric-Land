import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "New Response",
    message: "You have a new response to your inquiry about Fertile Farmland.",
    date: "2023-06-15",
  },
  {
    id: 2,
    title: "Listing Update",
    message: "The price for Orchard Paradise has been updated.",
    date: "2023-06-14",
  },
  {
    id: 3,
    title: "Inquiry Approved",
    message: "Your inquiry for Grazing Fields has been approved!",
    date: "2023-06-13",
  },
];

export function NotificationCenter() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Heading className="mb-4">Notifications</Heading>
      {mockNotifications.map((notification) => (
        <Card key={notification.id} onClick={onOpen}>
          <CardHeader>
            <Flex alignItems="center">
              <Bell className="mr-2 h-4 w-4" />
              <Heading size="sm">{notification.title}</Heading>
            </Flex>
            <Text fontSize="sm">{notification.date}</Text>
          </CardHeader>
          <CardBody>
            <Text>{notification.message}</Text>
          </CardBody>
        </Card>
      ))}
    </Box>
  );
}
