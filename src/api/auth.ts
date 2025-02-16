import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/Auth";
import axios from "./axios";

// Register User
export const registerUser = async ({
  username,
  email,
  password,
}: RegisterRequest): Promise<AuthResponse> => {
  const data = new URLSearchParams();
  data.append("register", "true");
  data.append("username", username);
  data.append("email", email);
  data.append("password", password);

  const response = await axios.post<AuthResponse>("/auth.php", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

// Login User
export const loginUser = async ({
  usernameOrEmail,
  password,
}: LoginRequest): Promise<AuthResponse> => {
  const data = new URLSearchParams();
  data.append("login", "true");
  data.append("usernameOrEmail", usernameOrEmail);
  data.append("password", password);

  const response = await axios.post<AuthResponse>("/auth.php", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

export const auth = {
  registerUser,
  loginUser,
};
