'use client';
import { useState, useEffect } from "react";
import { fetchUsers } from "../utils/fetchUsers";

export interface User {
  user_id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  user_type: string;
  date_joined: string;
}

const useFetchUsers = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { users, loading, error }
}

export default useFetchUsers;