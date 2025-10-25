"use client";
import { useState, useEffect } from "react";
import { fetchRegisterClinic } from "../utils/fetchRegisterClinic";

const useRegisterClinic = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null); 

  const registerClinic = async (clinicData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRegisterClinic(clinicData);
      setResult(res);
      return res;
    } catch (error) {
      setError((error as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { registerClinic, loading, error, result };
};

export default useRegisterClinic;
