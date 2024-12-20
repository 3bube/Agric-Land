import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Badge,
  Divider,
  useColorModeValue,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/utils/notification.utils";
import { useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { Filter, MoreVertical } from "lucide-react";

interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    inquiryId?: string;
    landId?: string;
    status?: string;
  };
}

export default function Notifications() {
  const { socket } = useChat();
  const queryClient = useQueryClient();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
    staleTime: 1000 * 60, // 1 minute
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  useEffect(() => {
    if (socket) {
      socket.on("new_notification", () => {
        queryClient.invalidateQueries(["notifications"]);
      });

      return () => {
        socket.off("new_notification");
      };
    }
  }, [socket, queryClient]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "inquiry_created":
        return "blue";
      case "inquiry_accepted":
        return "green";
      case "inquiry_rejected":
        return "red";
      case "system":
        return "purple";
      default:
        return "gray";
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const sortedNotifications = notifications?.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    const readA = a.read ? 1 : 0;
    const readB = b.read ? 1 : 0;
    return readA - readB || dateB.getTime() - dateA.getTime();
  });

  if (isLoading) {
    return (
      <Container maxW="container.lg" py={8}>
        <Text>Loading notifications...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={6}>
        <HStack justify="space-between" align="center">
          <Heading size="lg">Notifications</Heading>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<Filter />}
              variant="ghost"
              aria-label="Filter notifications"
            />
            <MenuList>
              <MenuItem>All Notifications</MenuItem>
              <MenuItem>Unread</MenuItem>
              <MenuItem>Inquiry Updates</MenuItem>
              <MenuItem>System Messages</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      <VStack spacing={4} align="stretch">
        {notifications?.length === 0 ? (
          <Box
            p={6}
            borderWidth={1}
            borderRadius="lg"
            bg={bgColor}
            textAlign="center"
          >
            <Text color="gray.500">No notifications yet</Text>
          </Box>
        ) : (
          sortedNotifications?.map((notification: Notification) => (
            <Box
              key={notification._id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              bg={bgColor}
              borderColor={borderColor}
              position="relative"
              opacity={notification.read ? 0.7 : 1}
            >
              <HStack justify="space-between" mb={2}>
                <Badge colorScheme={getNotificationColor(notification.type)}>
                  {notification.type.replace("_", " ").toUpperCase()}
                </Badge>
                {!notification.read && <Badge colorScheme="red">NEW</Badge>}
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<MoreVertical size={16} />}
                    variant="ghost"
                    size="sm"
                    aria-label="More options"
                  />
                  <MenuList>
                    {!notification.read && (
                      <MenuItem
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        Mark as read
                      </MenuItem>
                    )}
                    <MenuItem>View Details</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>

              <Text fontWeight="bold" mb={1}>
                {notification.title}
              </Text>
              <Text color="gray.600" mb={2}>
                {notification.message}
              </Text>

              <HStack justify="space-between" fontSize="sm" color="gray.500">
                <Text>
                  {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </Text>
              </HStack>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
}
