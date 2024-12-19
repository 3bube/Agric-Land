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
  } catch (error) {
    console.error("Error creating inquiry:", error);
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

export const getInquiriesForLandOwner = async (id: number) => {
  try {
    const res = await newRequest.get(`/inquiry/landowner/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting landowner inquiries:", error);
    throw error;
  }
};

export const updateInquiryStatus = async (
  inquiryId: string,
  status: string
) => {
  try {
    const res = await newRequest.put(`/inquiry/${inquiryId}/status`, {
      status,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    throw error;
  }
};
