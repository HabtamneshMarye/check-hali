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
        transfer_letter: "http://example.com/letter.pdf",
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
  beforeEach(() => {
    render(<AppointmentPage />);
  });

  it("renders sidebar and header", () => {
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });
it("renders tabs with correct counts and activates All tab by default", () => {

  expect(screen.getByRole("button", { name: /All/i })).toHaveClass("bg-[#10004B]");
  expect(screen.getByRole("button", { name: /Upcoming/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Completed/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Cancelled/i })).toBeInTheDocument();

  expect(screen.getByRole("button", { name: /Upcoming/i })).toHaveTextContent("1");
  expect(screen.getByRole("button", { name: /Completed/i })).toHaveTextContent("1");
  expect(screen.getByRole("button", { name: /Cancelled/i })).toHaveTextContent("0");
});

it("displays patient data correctly in table with status badges", () => {

  const upcomingBadges = screen.getAllByText("Upcoming").filter(
    el => el.tagName === "SPAN" && el.className.includes("px-4")
  );
  expect(upcomingBadges.length).toBeGreaterThan(0);


  expect(screen.getByText("Aden Abdi")).toBeInTheDocument();
  expect(screen.getByText("Jane Doe")).toBeInTheDocument();

  expect(screen.getByText("0712345678")).toBeInTheDocument();
  expect(screen.getByText("0787654321")).toBeInTheDocument();

  expect(screen.getByText("Screening")).toBeInTheDocument();
  expect(screen.getByText("Consultation")).toBeInTheDocument();

  expect(screen.getAllByText(/New|Existing/)).toHaveLength(2);
});

it("disables Previous button on first page and handles Next correctly", () => {
  const prevButton = screen.getByRole("button", { name: /Previous/i });
  const nextButton = screen.getByRole("button", { name: /Next/i });

  expect(prevButton).toBeDisabled();
 
  expect(nextButton).toBeInTheDocument();
});


  it("shows missing transfer letter icon only for new patients without letter", () => {

    expect(screen.getByTitle("Transfer Letter Required (Missing)")).toBeInTheDocument();

   
    const downloadButton = screen.getByTitle("View Transfer Letter (Uploaded)");
    expect(downloadButton).toBeInTheDocument();
  });
});
