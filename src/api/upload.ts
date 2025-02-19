import axios from "./axios";
import { ServerFileResponse } from "@/types/utils/ServerResponse";

// Function to upload one file
const uploadOne = async (file: File): Promise<ServerFileResponse> => {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const response = await axios.post("/files.php", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload successful: ", response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error("Error uploading single file: ", error); // Error logging for debugging
    throw error; // Re-throw error to handle it further up
  }
};

// Function to upload multiple files
const uploadMany = async (files: File[]): Promise<ServerFileResponse> => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files[]", file); // Ensure correct file array parameter
    });

    const response = await axios.post("/files.php", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload successful: ", response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error("Error uploading multiple files: ", error); // Error logging for debugging
    throw error; // Re-throw error to handle it further up
  }
};

// Exporting both functions
export const upload = {
  uploadOne,
  uploadMany,
};
