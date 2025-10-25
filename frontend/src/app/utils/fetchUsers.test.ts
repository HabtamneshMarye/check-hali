import { fetchUsers } from "../utils/fetchUsers";

global.fetch = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});

test("should handle success state", async () => {
  const mockData = { UsersData: { users: [{ id: 1 }] } };
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce(mockData),
  });

  const data = await fetchUsers();
  expect(data).toEqual(mockData);
  expect(global.fetch).toHaveBeenCalledWith("/api/users");
});

test("should handle error state", async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    statusText: "Bad Request",
  });

  await expect(fetchUsers()).rejects.toThrow(/Failed to fetch users:\s*Something went wrong[:|,]?\s*Bad Request/);
  expect(global.fetch).toHaveBeenCalledWith("/api/users");
});

test("should handle fetch failure", async () => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

  await expect(fetchUsers()).rejects.toThrow(/Failed to fetch users:\s*Network error/);
});

test("should handle empty state", async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce(null),
  });

  const data = await fetchUsers();
  expect(data).toBeNull();
  expect(global.fetch).toHaveBeenCalledWith("/api/users");
});
