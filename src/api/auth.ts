import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/Auth";
import axios from "./axios";

// Register User
export const registerUser = async ({
  username,
  email,
  password,
}: RegisterRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    "/auth.php?action=register",
    { username, email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Login User
export const loginUser = async ({
  usernameOrEmail,
  password,
}: LoginRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    "/auth.php?action=login",
    { usernameOrEmail, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const auth = {
  registerUser,
  loginUser,
};
