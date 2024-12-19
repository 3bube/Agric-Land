import newRequest from "./newRequest";

export const createOrGetChat = async (participantId: string) => {
  try {
    const res = await newRequest.post("/chat/create", { participantId });
    return res.data;
  } catch (error) {
    console.error("Error creating/getting chat:", error);
    throw error;
  }
};

export const sendMessage = async (chatId: string, content: string) => {
  try {
    const res = await newRequest.post("/chat/message", { chatId, content });
    return res.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getMessages = async (chatId: string) => {
  try {
    const res = await newRequest.get(`/chat/messages/${chatId}`);
    return res.data;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};

export const getUserChats = async () => {
  try {
    const res = await newRequest.get("/chat/user");
    return res.data;
  } catch (error) {
    console.error("Error getting user chats:", error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    const res = await newRequest.put(`/chat/message/read/${messageId}`);
    return res.data;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};
