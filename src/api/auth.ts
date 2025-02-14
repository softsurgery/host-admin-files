import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/Auth";
import axios from "./axios";

export const registerUser = async ({
  username,
  email,
  password,
}: RegisterRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    "/auth.php",
    {
      register: true,
      username,
      email,
      password,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

// Login User
export const loginUser = async ({
  username,
  password,
}: LoginRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    "/auth.php",
    {
      login: true,
      username,
      password,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data;
};

export const logoutUser = async (): Promise<AuthResponse> => {
  const response = await axios.get<AuthResponse>(`/auth.php?logout=true`);
  return response.data;
};

export const auth = {
  registerUser,
  loginUser,
  logoutUser,
};
