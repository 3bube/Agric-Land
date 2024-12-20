import newRequest from "./newRequest";

export const createInquiry = async ({
  farmer,
  land,
  message,
}: {
  farmer: string;
  land: string;
  message: string;
}) => {
  try {
    const res = await newRequest.post("/inquiry/create", {
      farmer,
      land,
      message,
    });
    return res.data;
  } catch (error: any) {
    console.error("Error creating inquiry:", error);
    if (error.response?.data) {
      throw new Error(error.response.data);
    }
    throw error;
  }
};

export const getInquiresForFarmer = async (farmerId: string) => {
  try {
    const res = await newRequest.get(`/inquiry/farmer/${farmerId}`);
    return res.data;
  } catch (error) {
    console.error("Error getting farmer inquiries:", error);
    throw error;
  }
};

export const getInquiriesForLandOwner = async () => {
  try {
    const res = await newRequest.get("/inquiry/landowner");
    return res.data;
  } catch (error) {
    console.error("Error getting landowner inquiries:", error);
    throw error;
  }
};

export const updateInquiryStatus = async (
  inquiryId: string,
  status: string,
  landId: string
) => {
  try {
    const res = await newRequest.put(`/inquiry/${inquiryId}/status`, {
      status,
      landId,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    throw error;
  }
};
