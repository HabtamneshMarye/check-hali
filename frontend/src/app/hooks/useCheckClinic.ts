"use client";
import { useState } from "react";
import { fetchCheckClinic } from "../utils/fetchCheckClinic";

const useCheckClinic = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkClinic = async (userId: string, token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCheckClinic(userId, token);
      return result.clinicExists;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { checkClinic, loading, error };
};

export default useCheckClinic;
