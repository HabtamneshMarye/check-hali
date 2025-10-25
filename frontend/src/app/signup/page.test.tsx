import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpPage from "./page";
import useRegister from "../hooks/useRegister";
import { useRouter } from "next/navigation";
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("../hooks/useRegister", () => ({
  __esModule: true,
  default: jest.fn(),
}));
describe("SignUpPage", () => {
  const mockRegister = jest.fn();
  const mockPush = jest.fn();
  beforeEach(() => {
    (useRegister as jest.Mock).mockReturnValue({
      register: mockRegister,
      loading: false,
      error: null,
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders all form fields", () => {
    render(<SignUpPage />);
    expect(screen.getByPlaceholderText("Enter first name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter last name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });
  it("shows error if passwords do not match", async () => {
    render(<SignUpPage />);
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass1" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "pass2" } });
    fireEvent.submit(screen.getByRole("button", { name: /Sign Up/i }).closest("form")!);
    await waitFor(() => {
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });
  it("calls register and redirects on successful registration", async () => {
    mockRegister.mockResolvedValueOnce(true);
    render(<SignUpPage />);
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: "mahado" } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Ali" } });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), { target: { value: "9876543210" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password" } });
    fireEvent.submit(screen.getByRole("button", { name: /Sign Up/i }).closest("form")!);
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        first_name: "mahado",
        last_name: "Ali",
        phone_number: "9876543210",
        password: "password",
        user_type: "CLINICIAN",
      });
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
  it("displays server error message if registration fails", () => {
    (useRegister as jest.Mock).mockReturnValue({
      register: jest.fn(),
      loading: false,
      error: "Registration failed",
    });
    render(<SignUpPage />);
    expect(screen.getByText("Registration failed")).toBeInTheDocument();
  });
  it("toggles password visibility", () => {
    render(<SignUpPage />);
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmInput = screen.getByPlaceholderText("Confirm Password");
    const passwordToggle = screen.getByLabelText("Show password");
    const confirmToggle = screen.getByLabelText("Show confirm password");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmInput).toHaveAttribute("type", "password");
    fireEvent.click(passwordToggle);
    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(passwordToggle);
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(confirmToggle);
    expect(confirmInput).toHaveAttribute("type", "text");
    fireEvent.click(confirmToggle);
    expect(confirmInput).toHaveAttribute("type", "password");
  });
});



