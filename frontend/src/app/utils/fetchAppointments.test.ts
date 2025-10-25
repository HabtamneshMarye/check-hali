import { fetchAppointments } from "../utils/fetchAppointments";

global.fetch = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});

test("should handle success state", async () => {
  const mockData = { AppointmentsData: { appointments: [{ id: 1 }] } };
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce(mockData),
  });

  const data = await fetchAppointments();
  expect(data).toEqual(mockData);
  expect(fetch).toHaveBeenCalledWith("/api/appointment");
});

test("should handle error state", async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    statusText: "Server Error",
  });

  await expect(fetchAppointments()).rejects.toThrow(
    "Failed to fetch appointments:Something went wrong:Server Error"
  );
  expect(fetch).toHaveBeenCalledWith("/api/appointment");
});


test("should handle empty state", async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce(null),
  });

  const data = await fetchAppointments();
  expect(data).toBeNull();
  expect(fetch).toHaveBeenCalledWith("/api/appointment");
});