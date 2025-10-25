import { renderHook, waitFor } from "@testing-library/react";
import useFetchUsers from "./useUsers";
import { fetchUsers } from "../utils/fetchUsers";
jest.mock("../utils/fetchUsers");
const mockedFetchUsers = fetchUsers as jest.Mock;
describe("useFetchUsers", () => {
  it("fetches and sets users successfully", async () => {
    const fakeUsers = [
      {
        user_id: "u1",
        phone_number: "0712345678",
        first_name: "Aden",
        last_name: "Abdi",
        user_type: "PATIENT",
        date_joined: "2025-09-22",
      },
    ];
    mockedFetchUsers.mockResolvedValueOnce(fakeUsers);
    const { result } = renderHook(() => useFetchUsers());
 
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.users).toEqual(fakeUsers);
    });
  });
  it("handles fetch error correctly", async () => {
    mockedFetchUsers.mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useFetchUsers());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Network error");
      expect(result.current.users).toEqual([]);
    });
  });
});
