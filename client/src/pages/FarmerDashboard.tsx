import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  useToast,
  VStack,
  Text,
  Badge,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchableListings } from "@/components/SearchableListings";
import { InquiryTracker } from "@/components/InquiryTracker";
import { useChat } from "@/context/ChatContext";
import { useEffect, useState } from "react";
import { ChatWindow } from "@/components/ChatWindow";

interface Notification {
  type: string;
  content: string;
  from: string;
  timestamp: Date;
}

export default function FarmerDashboard() {
  const toast = useToast();
  const { socket } = useChat();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatPartner, setChatPartner] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (socket) {
      // Listen for inquiry status updates
      socket.on("inquiry_update", (data) => {
        toast({
          title: "Inquiry Update",
          description: `Your inquiry for ${data.landTitle} has been ${data.status}`,
          status: data.status === "accepted" ? "success" : "info",
          duration: 5000,
          isClosable: true,
        });
      });

      // Listen for new messages
      socket.on("new_message", (data) => {
        const { from, message } = data;
        toast({
          title: "New Message",
          description: `${from.name}: ${message}`,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      });

      // Listen for notifications
      socket.on("notification", (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        toast({
          title: "New Notification",
          description: notification.content,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      });

      // Listen for chat invitations
      socket.on("chat_invitation", (data) => {
        const { chatId, from } = data;
        toast({
          title: "Chat Invitation",
          description: `${from.name} wants to chat with you`,
          status: "info",
          duration: null,
          isClosable: true,
          action: (
            <Box mt={2}>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => {
                  setActiveChatId(chatId);
                  setChatPartner({ _id: from._id, name: from.name });
                }}
              >
                Accept
              </Button>
            </Box>
          ),
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("inquiry_update");
        socket.off("new_message");
        socket.off("notification");
        socket.off("chat_invitation");
      }
    };
  }, [socket, toast]);

  return (
    <Container maxW="container.2xl" py={8}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          <VStack align="stretch" spacing={6}>
            <Box>
              <Heading size="lg" mb={4}>
                Farmer Dashboard
              </Heading>
              <SearchableListings />
            </Box>
          </VStack>
        </GridItem>
      </Grid>

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
