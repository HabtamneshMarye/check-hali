import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tab from "./index";

describe("Tab component", () => {
  it("renders label and count correctly", () => {
    render(<Tab label="Upcoming" count={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
  });

  it("applies inactive styles by default", () => {
    render(<Tab label="Cancel" count={2} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-[#9EABC1]");
    expect(button).toHaveClass("text-white");
    expect(button).not.toHaveClass("bg-[#10004B]");
  });

  it("applies active styles when active prop is true", () => {
    render(<Tab label="Active" count={7} active />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-[#10004B]");
    expect(button).toHaveClass("text-white");
    expect(button).not.toHaveClass("bg-[#9EABC1]");
  });

  it("calls onClick handler when clicked", () => {
    const onClick = jest.fn();
    render(<Tab label="Clickable" count={3} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies disabled styles and prevents interaction when disabled", () => {
    const onClick = jest.fn();
    render(<Tab label="Disabled" count={4} disabled onClick={onClick} />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("bg-gray-300");
    expect(button).toHaveClass("text-gray-500");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});