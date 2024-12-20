import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  Text,
  Avatar,
  HStack,
  Input,
  IconButton,
  useColorModeValue,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useChat } from "@/context/ChatContext";
import { useEffect, useState } from "react";
import { getUserChats } from "@/utils/chat.utils";
import { formatDistanceToNow } from "date-fns";
import { Search, MessageCircle } from "lucide-react";

interface Chat {
  _id: string;
  participants: {
    _id: string;
    name: string;
    email: string;
  }[];
  lastMessage?: string;
  updatedAt: string;
}

export default function Messages() {
  const { socket } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getUserChats,
  });

  const filteredChats = chats?.filter((chat: Chat) => {
    const otherParticipant = chat.participants.find((p) => p._id !== user._id);
    return otherParticipant?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading chats...</Text>
      </Container>
    );
  }

  return (
    <Container maxW={"container.3xl"}>
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        height="100vh"
      >
        <VStack p={4} spacing={4} align="stretch">
          <Heading size="md">Messages</Heading>
          <Box position="relative">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              pr="40px"
            />
            <IconButton
              aria-label="Search"
              icon={<Search size={20} />}
              position="absolute"
              right={2}
              top="50%"
              transform="translateY(-50%)"
              variant="ghost"
            />
          </Box>
          <Divider />
          <VStack
            spacing={2}
            align="stretch"
            overflowY="auto"
            maxHeight="calc(80vh - 140px)"
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
            {filteredChats?.length === 0 ? (
              <Box textAlign="center" py={4}>
                <MessageCircle size={40} />
                <Text mt={2}>No messages yet</Text>
              </Box>
            ) : (
              filteredChats?.map((chat: Chat) => {
                const otherParticipant = chat.participants.find(
                  (p) => p._id !== user._id
                );
                return (
                  <Box
                    key={chat._id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    onClick={() =>
                      (window.location.href = `/dashboard/${user.role}/chat/${chat._id}`)
                    }
                  >
                    <HStack spacing={3}>
                      <Avatar size="sm" name={otherParticipant?.name} />
                      <Box flex="1">
                        <HStack justify="space-between">
                          <Text fontWeight="bold">
                            {otherParticipant?.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {formatDistanceToNow(new Date(chat.updatedAt), {
                              addSuffix: true,
                            })}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.500" noOfLines={1}>
                          {chat.lastMessage ?? "No messages yet"}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                );
              })
            )}
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
}
