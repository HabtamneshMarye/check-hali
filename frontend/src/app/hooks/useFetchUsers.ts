import { useEffect, useState } from "react";
import { fetchUsers } from "../utils/fetchUsers";
import { UserType } from "../utils/type";

const useFetchUsers = () => {
    const [users, setUsers] = useState<Array<UserType>>([]);
    const [usersloading, setLoading] = useState<boolean>(true);
    const [userserror, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const users = await fetchUsers();
                setUsers(users ?? []);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { users, usersloading, userserror };
};

export default useFetchUsers;
