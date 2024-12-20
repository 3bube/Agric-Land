import newRequest from "./newRequest";

export const createRental = async (data: {
  inquiryId: string;
  startDate: string;
  endDate: string;
  rentalAmount: number;
  terms: string;
}) => {
  try {
    const response = await newRequest.post("/rentals", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRentals = async () => {
  try {
    const response = await newRequest.get("/rentals");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signRental = async (rentalId: string) => {
  try {
    const response = await newRequest.put(`/rentals/${rentalId}/sign`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRentalStatus = async (rentalId: string, status: string) => {
  try {
    const response = await newRequest.put(`/rentals/${rentalId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentStatus = async (rentalId: string, paymentStatus: string) => {
  try {
    const response = await newRequest.put(`/rentals/${rentalId}/payment-status`, {
      paymentStatus,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
