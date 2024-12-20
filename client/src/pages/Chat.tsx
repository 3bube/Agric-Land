import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  IconButton,
  HStack,
  Avatar,
  useColorModeValue,
  Button,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useChat } from "@/context/ChatContext";
import { useEffect, useRef, useState } from "react";
import { getUserChats, sendMessage } from "@/utils/chat.utils";
import { formatDistanceToNow } from "date-fns";
import { Send, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Chat {
  _id: string;
  participants: {
    _id: string;
    name: string;
    email: string;
  }[];
  messages: Message[];
}

export default function Chat() {
  const { chatId } = useParams();
  const { socket } = useChat();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { data: chat, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getUserChats(chatId!),
    enabled: !!chatId,
  });

  console.log(chat);

  const sendMessageMutation = useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) =>
      sendMessage(chatId, content),
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries(["chat", chatId]);
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  useEffect(() => {
    if (socket) {
      socket.on("new_message", () => {
        queryClient.invalidateQueries(["chat", chatId]);
      });

      return () => {
        socket.off("new_message");
      };
    }
  }, [socket, queryClient, chatId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && chatId) {
      sendMessageMutation.mutate({ chatId, content: message.trim() });
    }
  };

  const otherParticipant = chat?.map((p) =>
    p.participants.find((p) => p._id !== user._id)
  )?.[0];

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading chat...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.3xl" py={8}>
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        height="80vh"
      >
        {/* Chat Header */}
        <HStack
          p={4}
          borderBottomWidth="1px"
          borderColor={borderColor}
          spacing={4}
        >
          <IconButton
            icon={<ArrowLeft />}
            aria-label="Back"
            variant="ghost"
            onClick={() => navigate(`/dashboard/${user.role}/messages`)}
          />
          <Avatar size="sm" name={otherParticipant?.name} />
          <Box flex="1">
            <Heading size="sm">{otherParticipant?.name}</Heading>
            <Text fontSize="xs" color="gray.500">
              {otherParticipant?.email}
            </Text>
          </Box>
        </HStack>

        {/* Messages */}
        <VStack
          p={4}
          spacing={4}
          height="calc(80vh - 160px)"
          overflowY="auto"
          align="stretch"
          css={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.200",
              borderRadius: "24px",
            },
          }}
        >
          {chat?.map(({ messages }: { messages: Message[] }) =>
            messages.map((message) => (
              <Box
                key={message._id}
                alignSelf={
                  message.sender === user._id ? "flex-end" : "flex-start"
                }
                maxW="70%"
              >
                <Box
                  bg={message.sender === user._id ? "blue.500" : "gray.100"}
                  color={message.sender === user._id ? "white" : "black"}
                  p={3}
                  borderRadius="lg"
                >
                  <Text>{message.content}</Text>
                </Box>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Text>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </VStack>

        {/* Message Input */}
        <HStack
          as="form"
          onSubmit={handleSendMessage}
          p={4}
          borderTopWidth="1px"
          borderColor={borderColor}
          spacing={4}
        >
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            colorScheme="blue"
            aria-label="Send message"
            icon={<Send />}
            type="submit"
            isLoading={sendMessageMutation.isLoading}
          />
        </HStack>
      </Box>
    </Container>
  );
}
