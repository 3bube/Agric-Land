import newRequest from "./newRequest";

export const addFavorite = async (userId: string, landId: string) => {
  try {
    const res = await newRequest.post("/favorite/add", { userId, landId });
    return res.data;
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

export const getFavorites = async (userId: string) => {
  try {
    const res = await newRequest.get(`/favorite/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error getting favorites:", error);
    throw error;
  }
};

export const removeFavorite = async (userId: string, landId: string) => {
  try {
    const res = await newRequest.delete(`/favorite/${userId}/${landId}`);
    return res.data;
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};
