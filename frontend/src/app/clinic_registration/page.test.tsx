import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ClinicForm from "./page";
import useRegisterClinic from "../hooks/useRegisterClinic";

jest.mock("../hooks/useRegisterClinic");

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("ClinicForm Component", () => {
  const mockRegisterClinic = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    (useRegisterClinic as jest.Mock).mockReturnValue({
      registerClinic: mockRegisterClinic,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("calls registerClinic on submit, shows success message, and redirects", async () => {
    mockRegisterClinic.mockResolvedValueOnce({ id: "fake-id" });

    const { container } = render(<ClinicForm />);

    fireEvent.change(container.querySelector('input[name="clinicName"]')!, { target: { value: "Uzima Clinic" } });
    fireEvent.change(container.querySelector('input[name="contact"]')!, { target: { value: "0712345678" } });
    fireEvent.change(container.querySelector('input[name="address"]')!, { target: { value: "Karen" } });
    window.localStorage.setItem("user_id", "dummy-user-id");

    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });
    await waitFor(() => {
      expect(mockRegisterClinic).toHaveBeenCalled();
      expect(screen.getByText(/Clinic registered successfully/i)).toBeInTheDocument();
    });
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
