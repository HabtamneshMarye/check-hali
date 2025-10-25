
import { renderHook, waitFor } from "@testing-library/react";
import useFetchAppointment from "./useAppointment";
import { fetchAppointments } from "../utils/fetchAppointment";
jest.mock("../utils/fetchAppointment");
const mockedFetchAppointments = fetchAppointments as jest.Mock;
describe("useFetchAppointment", () => {
  it("fetches and sets appointments successfully", async () => {
    const fakeAppointments = [
      {
        appointment_id: "1",
        booking_status: "Upcoming",
        transfer_letter: "Letter1",
        appointment_date: "2025-09-22",
        user_id: "e251",
        center_id: "c1",
        service_id: "s1",
      },
    ];
    mockedFetchAppointments.mockResolvedValueOnce(fakeAppointments);
    const { result } = renderHook(() => useFetchAppointment());
    
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.appointments).toEqual(fakeAppointments);
    });
  });
  it("handles fetch error", async () => {
    mockedFetchAppointments.mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useFetchAppointment());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Network error");
      expect(result.current.appointments).toEqual([]);
    });
  });
});
