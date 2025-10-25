import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppointmentHeader from "./index"; 
describe("AppointmentHeader", () => {
  const baseDate = new Date(2025, 8, 22);
  const mockSetSelectedDateAndLabel = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders with initial props", () => {
    render(
      <AppointmentHeader
        selectedDate={baseDate}
        selectedLabel="Today"
        setSelectedDateAndLabel={mockSetSelectedDateAndLabel}
      />
    );
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText(baseDate.toDateString())).toBeInTheDocument();
    expect(screen.getByText("Appointments")).toBeInTheDocument();
  });
  it("opens and closes the dropdown", () => {
    render(
      <AppointmentHeader
        selectedDate={baseDate}
        selectedLabel="Today"
        setSelectedDateAndLabel={mockSetSelectedDateAndLabel}
      />
    );
  
    expect(screen.queryByText("Tomorrow")).not.toBeInTheDocument();
  
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Tomorrow")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("Tomorrow")).not.toBeInTheDocument();
  });
  it("selects Tomorrow", () => {
    render(
      <AppointmentHeader
        selectedDate={baseDate}
        selectedLabel="Today"
        setSelectedDateAndLabel={mockSetSelectedDateAndLabel}
      />
    );
  
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Tomorrow"));
   
    expect(mockSetSelectedDateAndLabel).toHaveBeenCalledWith(
      expect.any(Date),
      "Tomorrow"
    );
  });
  it("changes date with the date picker input", () => {
    const { container } = render(
      <AppointmentHeader
        selectedDate={baseDate}
        selectedLabel="Today"
        setSelectedDateAndLabel={mockSetSelectedDateAndLabel}
      />
    );
 
    fireEvent.click(screen.getByRole("button"));

    const input = container.querySelector('input[type="date"]') as HTMLInputElement | null;
    expect(input).toBeTruthy();
  
    fireEvent.change(input as HTMLInputElement, { target: { value: "2025-09-25" } });

    expect(mockSetSelectedDateAndLabel).toHaveBeenCalledWith(
      expect.any(Date),
      expect.stringContaining("Sep 25 2025")
    );
  });
});