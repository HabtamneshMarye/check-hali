import { renderHook, waitFor,act} from "@testing-library/react";
import useFetchAppointments from "../hooks/useFetchAppointments";
import { fetchAppointments } from "../utils/fetchAppointments";

jest.mock("../utils/fetchAppointments");

describe("useFetchAppointments", () => {
  test("should handle loading state", () => {
    const { result } = renderHook(() => useFetchAppointments());
    expect(result.current.appointmentsloading).toBe(true);
    expect(result.current.appointments).toEqual([]);
    expect(result.current.appointmentserror).toBeNull();
  });

  test("should  handle success state", async () => {
    (fetchAppointments as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);
    const { result } = renderHook(() => useFetchAppointments());
    await waitFor(() => expect(result.current.appointmentsloading).toBe(false));

    expect(result.current.appointments).toEqual([{ id: 1 }]);
    expect(result.current.appointmentserror).toBeNull();
  });

  test("should handle empty state", async () => {
    (fetchAppointments as jest.Mock).mockResolvedValueOnce([]);
    const { result } = renderHook(() => useFetchAppointments());
    await waitFor(() => expect(result.current.appointmentsloading).toBe(false));

    expect(result.current.appointments).toEqual([]);
    expect(result.current.appointmentserror).toBeNull();
  });

  test("should handle error state", async () => {
    const errorMessage = "Network Error";
    (fetchAppointments as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useFetchAppointments());
    await waitFor(() => expect(result.current.appointmentsloading).toBe(false));

    expect(result.current.appointmentserror).toBe(errorMessage);
    expect(result.current.appointments).toEqual([]);
  });
});