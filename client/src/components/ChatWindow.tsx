import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  Flex,
  useColorModeValue,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { Send, X } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "@/utils/chat.utils";

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
  };
  content: string;
  createdAt: string;
}

interface ChatWindowProps {
  chatId: string;
  recipient: {
    _id: string;
    name: string;
  };
  onClose: () => void;
}

export function ChatWindow({ chatId, recipient, onClose }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, onlineUsers } = useChat();
  const queryClient = useQueryClient();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["messages", chatId],
    queryFn: () => getMessages(chatId),
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => sendMessage(chatId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", chatId]);
      setNewMessage("");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("new_message", (data) => {
        if (data.chatId === chatId) {
          queryClient.invalidateQueries(["messages", chatId]);
        }
      });

      return () => {
        socket.off("new_message");
      };
    }
  }, [socket, chatId, queryClient]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  const isOnline = onlineUsers.includes(recipient._id);

  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      width="350px"
      height="500px"
      bg={bgColor}
      borderRadius="lg"
      boxShadow="lg"
      border="1px"
      borderColor={borderColor}
      zIndex={1000}
    >
      <VStack height="100%" spacing={0}>
        {/* Header */}
        <HStack
          w="100%"
          p={3}
          borderBottom="1px"
          borderColor={borderColor}
          justify="space-between"
        >
          <HStack>
            <Avatar size="sm" name={recipient.name} />
            <Box>
              <Text fontWeight="bold">{recipient.name}</Text>
              <Badge
                colorScheme={isOnline ? "green" : "gray"}
                variant="subtle"
                size="sm"
              >
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </Box>
          </HStack>
          <IconButton
            aria-label="Close chat"
            icon={<X />}
            size="sm"
            onClick={onClose}
          />
        </HStack>

        {/* Messages */}
        <VStack
          flex={1}
          w="100%"
          p={4}
          overflowY="auto"
          spacing={4}
          alignItems="stretch"
        >
          {messages.map((message) => (
            <Flex
              key={message._id}
              justify={
                message.sender._id === recipient._id ? "flex-start" : "flex-end"
              }
            >
              <Box
                maxW="70%"
                bg={
                  message.sender._id === recipient._id
                    ? "gray.100"
                    : "blue.500"
                }
                color={
                  message.sender._id === recipient._id ? "black" : "white"
                }
                px={3}
                py={2}
                borderRadius="lg"
              >
                <Text fontSize="sm">{message.content}</Text>
                <Text fontSize="xs" opacity={0.8}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Text>
              </Box>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </VStack>

        {/* Input */}
        <Box w="100%" p={3} borderTop="1px" borderColor={borderColor}>
          <form onSubmit={handleSendMessage}>
            <HStack>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                size="sm"
              />
              <IconButton
                aria-label="Send message"
                icon={<Send size={20} />}
                size="sm"
                colorScheme="blue"
                type="submit"
                isLoading={sendMessageMutation.isLoading}
              />
            </HStack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
}
