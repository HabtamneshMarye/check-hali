import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppointmentHeader from "./index";

const baseDateStart = new Date(2025, 8, 22);
const baseDateEnd = new Date(2025, 8, 22);

describe("AppointmentHeader", () => {
  const mockSetSelectedRangeAndLabel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with initial props showing label and date range", () => {
    render(
      <AppointmentHeader
        selectedRange={{ start: baseDateStart, end: baseDateEnd }}
        selectedLabel="Today"
        setSelectedRangeAndLabel={mockSetSelectedRangeAndLabel}/>
    );
    
    expect(screen.getAllByText("Today").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Appointments")).toBeInTheDocument();
  });

  it("opens and closes dropdown on clicking button and outside click", () => {
    render(
      <AppointmentHeader
        selectedRange={{ start: baseDateStart, end: baseDateEnd }}
        selectedLabel="Today"
        setSelectedRangeAndLabel={mockSetSelectedRangeAndLabel}/>
    );

    expect(screen.queryByText("Tomorrow")).not.toBeInTheDocument();

  
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Tomorrow")).toBeInTheDocument();


    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("Tomorrow")).not.toBeInTheDocument();
  });

  it("selects 'Tomorrow' quick range and triggers callback", () => {
    render(
      <AppointmentHeader
        selectedRange={{ start: baseDateStart, end: baseDateEnd }}
        selectedLabel="Today"
        setSelectedRangeAndLabel={mockSetSelectedRangeAndLabel}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Tomorrow"));

    expect(mockSetSelectedRangeAndLabel).toHaveBeenCalledWith(
      expect.objectContaining({
        start: expect.any(Date),
        end: expect.any(Date),
      }),
      "Tomorrow"
    );
  });

  it("allows entering valid custom date range and applies it", () => {
    const { container } = render(
      <AppointmentHeader
        selectedRange={{ start: baseDateStart, end: baseDateEnd }}
        selectedLabel="Today"
        setSelectedRangeAndLabel={mockSetSelectedRangeAndLabel}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    const inputs = container.querySelectorAll('input[type="date"]');
    expect(inputs.length).toBe(2);

    const [startInput, endInput] = inputs;

    fireEvent.change(startInput, { target: { value: "2025-09-23" } });
    fireEvent.change(endInput, { target: { value: "2025-09-24" } });

    const applyButton = screen.getByRole("button", { name: /apply/i });
    expect(applyButton).toBeEnabled();

    fireEvent.click(applyButton);

 
    expect(mockSetSelectedRangeAndLabel).toHaveBeenCalledWith(
      expect.objectContaining({
        start: expect.any(Date),
        end: expect.any(Date),
      }),
      "Custom Range"
    );
  });

  it("shows error and disables apply button if custom start > end", () => {
    const { container } = render(
      <AppointmentHeader
        selectedRange={{ start: baseDateStart, end: baseDateEnd }}
        selectedLabel="Today"
        setSelectedRangeAndLabel={mockSetSelectedRangeAndLabel}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    const inputs = container.querySelectorAll('input[type="date"]');
    const [startInput, endInput] = inputs;

    fireEvent.change(startInput, { target: { value: "2025-09-25" } });
    fireEvent.change(endInput, { target: { value: "2025-09-23" } });

    expect(screen.getByText(/start date cannot be after end date/i)).toBeInTheDocument();

    const applyButton = screen.getByRole("button", { name: /apply/i });
    expect(applyButton).toBeDisabled();

    fireEvent.change(endInput, { target: { value: "2025-09-26" } });

    expect(screen.queryByText(/cannot be after/i)).not.toBeInTheDocument();
    expect(applyButton).toBeEnabled();
  });
});
