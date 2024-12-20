import newRequest from "./newRequest";

export const getNotifications = async () => {
  try {
    const res = await newRequest.get("/notifications");
    return res.data;
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const res = await newRequest.put(`/notifications/read/${notificationId}`);
    return res.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const getUnreadCount = async () => {
  try {
    const res = await newRequest.get("/notifications/unread/count");
    return res.data;
  } catch (error) {
    console.error("Error getting unread count:", error);
    throw error;
  }
};
