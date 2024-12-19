import newRequest from "./newRequest";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "farmer" | "landowner";
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const response = await newRequest.post(`/auth/register`, data);
  return response.data;
};

export const login = async (data: LoginData) => {
  try {
    const response = await newRequest.post(`/auth/login`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
