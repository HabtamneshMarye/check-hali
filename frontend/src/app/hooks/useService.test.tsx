import { renderHook, waitFor } from "@testing-library/react";
import useFetchServices from "./useService";
import { fetchServices } from "../utils/fetchServices";
jest.mock("../utils/fetchServices");
const mockedFetchServices = fetchServices as jest.Mock;
describe("useFetchServices", () => {
  it("fetches and sets services successfully", async () => {
    const fakeServices = [
      {
        service_id: "s1",
        service_name: "ARV",
        status: "Active",
        description: "",
        last_updated: "2025-09-22",
        center_id: "c1",
      },
    ];
    mockedFetchServices.mockResolvedValueOnce(fakeServices);
    const { result } = renderHook(() => useFetchServices());
 
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.services).toEqual(fakeServices);
    });
  });
  it("handles fetch error", async () => {
    mockedFetchServices.mockRejectedValueOnce(new Error("Server down"));
    const { result } = renderHook(() => useFetchServices());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Server down");
      expect(result.current.services).toEqual([]);
    });
  });
});
