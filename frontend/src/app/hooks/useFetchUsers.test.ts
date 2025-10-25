import { renderHook, waitFor } from "@testing-library/react";
import useFetchUsers from "../hooks/useFetchUsers";
import { fetchUsers } from "../utils/fetchUsers";

jest.mock("../utils/fetchUsers");

describe("useFetchUsers", () => {
  test("should handle loading state", () => {
    const { result } = renderHook(() => useFetchUsers());
    expect(result.current.usersloading).toBe(true);
    expect(result.current.users).toEqual([]);
    expect(result.current.userserror).toBeNull();
  });

  test("should handle success state", async () => {
    (fetchUsers as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);
    const { result } = renderHook(() => useFetchUsers());
    await waitFor(() => expect(result.current.usersloading).toBe(false));

    expect(result.current.users).toEqual([{ id: 1 }]);
    expect(result.current.userserror).toBeNull();
  });

  test("should handle empty state", async () => {
    (fetchUsers as jest.Mock).mockResolvedValueOnce([]);
    const { result } = renderHook(() => useFetchUsers());
    await waitFor(() => expect(result.current.usersloading).toBe(false));

    expect(result.current.users).toEqual([]);
    expect(result.current.userserror).toBeNull();
  });

  test("should handle error state", async () => {
    const errorMessage = "Network Error";
    (fetchUsers as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useFetchUsers());
    await waitFor(() => expect(result.current.usersloading).toBe(false));

    expect(result.current.userserror).toBe(errorMessage);
    expect(result.current.users).toEqual([]);
  });

});