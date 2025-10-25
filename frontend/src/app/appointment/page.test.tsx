import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppointmentPage from "./page";

const todayISOString = new Date().toISOString().split("T")[0];

jest.mock("../hooks/useAppointment", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    appointments: [
      {
        appointment_id: "1",
        user_id: "u1",
        center_id: "c1",
        service_id: "s1",
        appointment_date: todayISOString,
        booking_status: "Upcoming",
        transfer_letter: null,
      },
      {
        appointment_id: "2",
        user_id: "u2",
        center_id: "c1",
        service_id: "s2",
        appointment_date: todayISOString,
        booking_status: "Completed",
        transfer_letter: null,
      },
    ],
    loading: false,
    error: null,
  })),
}));

jest.mock("../hooks/useUsers", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    users: [
      {
        user_id: "u1",
        first_name: "Aden",
        last_name: "Abdi",
        phone_number: "0712345678",
        user_type: "PATIENT",
        date_joined: "2025-01-01",
      },
      {
        user_id: "u2",
        first_name: "Jane",
        last_name: "Doe",
        phone_number: "0787654321",
        user_type: "PATIENT",
        date_joined: "2025-02-01",
      },
    ],
    loading: false,
    error: null,
  })),
}));

jest.mock("../hooks/useService", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    services: [
      { service_id: "s1", service_name: "Screening" },
      { service_id: "s2", service_name: "Consultation" },
    ],
    loading: false,
    error: null,
  })),
}));

jest.mock("./components/Header", () => () => <div data-testid="header">MockHeader</div>);
jest.mock("../shared-components/Sidebar", () => () => <div data-testid="sidebar">MockSidebar</div>);

describe("AppointmentPage", () => {
  it("renders patient appointment table with correct data", () => {
    render(<AppointmentPage />);

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();

    const statusBadges = screen.getAllByText(/Upcoming|Completed/).filter(
      el => el.tagName === 'SPAN' && el.classList.contains('px-4')
    );
    expect(statusBadges).toHaveLength(2);
    expect(statusBadges.some(el => el.textContent === "Upcoming")).toBe(true);
    expect(statusBadges.some(el => el.textContent === "Completed")).toBe(true);

    expect(screen.getByText("Aden")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Screening")).toBeInTheDocument();
    expect(screen.getByText("Consultation")).toBeInTheDocument();
  });

  it("filters appointments by search input", () => {
    render(<AppointmentPage />);

    const searchBox = screen.getByPlaceholderText("Search by patient name");
    fireEvent.change(searchBox, { target: { value: "Jane" } });

    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.queryByText("Aden")).not.toBeInTheDocument();

    fireEvent.change(searchBox, { target: { value: "XYZ" } });
    expect(screen.getByText("No appointments found")).toBeInTheDocument();
  });

  it("filters appointments by tab (e.g., Upcoming)", () => {
    render(<AppointmentPage />);

    const upcomingTab = screen.getAllByText("Upcoming").find(
      el => el.closest('button') && el.classList.contains('text-xs')
    );
    expect(upcomingTab).toBeInTheDocument();

    fireEvent.click(upcomingTab!);

    expect(screen.getByText("Aden")).toBeInTheDocument();
    expect(screen.queryByText("Jane")).not.toBeInTheDocument();
  });

  it("disables Previous button on first page", () => {
    render(<AppointmentPage />);
    const prevButton = screen.getByRole("button", { name: /Previous/i });
    expect(prevButton).toBeDisabled();
  });

  it("shows missing transfer letter icon for new patients without letter", () => {
    render(<AppointmentPage />);

    const missingIcons = screen.getAllByTitle("Transfer Letter Required (Missing)");
    expect(missingIcons.length).toBe(2); 
  });
});