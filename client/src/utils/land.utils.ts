import newRequest from "./newRequest";

interface Land {
  _id: string;
  title: string;
  description: string;
  location: string;
  size: number;
  price: number;
  status: 'available' | 'rented' | 'sold';
  ownerId: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const createLand = async (data: Omit<Land, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Land>> => {
  try {
    const res = await newRequest.post<ApiResponse<Land>>("/land/create", data);
    return res.data;
  } catch (error) {
    console.error("Error creating land:", error);
    throw error;
  }
};

export const getLandsByOwner = async (ownerId: string): Promise<ApiResponse<Land[]>> => {
  try {
    const res = await newRequest.get<ApiResponse<Land[]>>(`/land/${ownerId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching owner lands:", error);
    throw error;
  }
};

export const getAvailableLands = async (status: Land['status']): Promise<ApiResponse<{ count: number; lands: Land[] }>> => {
  try {
    const res = await newRequest.get<ApiResponse<{ count: number; lands: Land[] }>>(`/land/available/${status}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching available lands:", error);
    throw error;
  }
};

export const changeLandStatus = async (status: Land['status'], landId: string): Promise<ApiResponse<Land>> => {
  try {
    const res = await newRequest.put<ApiResponse<Land>>(`/land/status/${landId}`, { status });
    return res.data;
  } catch (error) {
    console.error("Error changing land status:", error);
    throw error;
  }
};

export const deleteLand = async (landId: string): Promise<ApiResponse<Land>> => {
  try {
    const res = await newRequest.delete<ApiResponse<Land>>(`/land/delete/${landId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting land:", error);
    throw error;
  }
};
