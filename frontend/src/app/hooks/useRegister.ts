"use client";
import { useState } from "react";
import { fetchRegister } from "../utils/fetchRegister";

const useRegister = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: object) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRegister(userData);
      if (!result) {
        throw new Error("Registration failed");
      }
      return result;
    } catch (error) {
      setError((error as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export default useRegister;