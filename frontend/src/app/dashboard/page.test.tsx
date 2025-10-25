import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard, { countAppointments, countServices } from "./page";
jest.mock("react-chartjs-2", () => ({
  Pie: () => <div data-testid="pie-chart" />,
  Doughnut: () => <div data-testid="doughnut-chart" />,
  Bar: () => <div data-testid="bar-chart" />,
}));
jest.mock("../hooks/useAppointment", () => ({
  __esModule: true,
  default: () => ({
    appointments: [
      { booking_status: "Completed", user_id: 1, appointment_date: "2025-01-01" },
      { booking_status: "Cancelled", user_id: 2, appointment_date: "2025-03-05" },
    ],
  }),
}));
jest.mock("../hooks/useFetchServices", () => ({
  __esModule: true,
  default: () => ({
    services: [
      { service_name: "ARV Refills" },
      { service_name: "Counselling" },
      { service_name: "Testing" },
    ],
  }),
}));
jest.mock("../hooks/useFetchUsers", () => ({
  __esModule: true,
  default: () => ({
    users: [
      { user_id: 1, user_type: "patient" },
      { user_id: 2, user_type: "patient" },
      { user_id: 3, user_type: "staff" },
    ],
  }),
}));

jest.mock("../shared-components/Layout", () => () => <div data-testid="layout" />);
describe("Dashboard Component", () => {
  test("renders dashboard with cards and charts", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getAllByText(/Total Patients/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Appointments/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Services/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
  test("countAppointments correctly counts completed and cancelled", () => {
    const input = [
      { booking_status: "Completed" },
      { booking_status: "Completed" },
      { booking_status: "Cancelled" },
    ];
    const result = countAppointments(input);
    expect(result.completed).toBe(2);
    expect(result.cancelled).toBe(1);
  });
  test("countServices correctly counts different services", () => {
    const input = [
      { service_name: "ARV Refills" },
      { service_name: "Counselling" },
      { service_name: "Testing" },
      { service_name: "Counselling" },
    ];
    const result = countServices(input);
    expect(result.arv).toBe(1);
    expect(result.counselling).toBe(2);
    expect(result.testing).toBe(1);
  });
});









