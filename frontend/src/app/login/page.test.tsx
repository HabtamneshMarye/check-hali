import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./page";
import { useRouter } from "next/navigation";
import useLogin from "../hooks/useLogin";
import useCheckClinic from "../hooks/useCheckClinic";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("../hooks/useLogin");
jest.mock("../hooks/useCheckClinic");

describe("LoginPage", () => {
  const pushMock = jest.fn();
  const loginMock = jest.fn();
  const checkClinicMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useLogin as jest.Mock).mockReturnValue({
      login: loginMock,
      loading: false,
      error: null,
    });
    (useCheckClinic as jest.Mock).mockReturnValue({
      checkClinic: checkClinicMock,
    });

    pushMock.mockClear();
    loginMock.mockClear();
    checkClinicMock.mockClear();

    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem(key: string) {
          return store[key] || null;
        },
        setItem(key: string, value: string) {
          store[key] = value;
        },
        removeItem(key: string) {
          delete store[key];
        },
        clear() {
          store = {};
        },
      };
    })();
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
    window.localStorage.clear();
  });

  it("logs in successfully and redirects based on clinic check", async () => {
    loginMock.mockResolvedValueOnce({ token: "fake-token", user_id: "user123" });
    checkClinicMock.mockResolvedValueOnce(true); 

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "0712345678", name: "phone_number" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "mypassword", name: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        phone_number: "0712345678",
        password: "mypassword",
      });
    });

    await waitFor(() => {
      expect(window.localStorage.getItem("token")).toBe("fake-token");
      expect(window.localStorage.getItem("user_id")).toBe("user123");
      expect(checkClinicMock).toHaveBeenCalledWith("user123", "fake-token");
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("logs in and redirects to clinic_registration if no clinic", async () => {
    loginMock.mockResolvedValueOnce({ token: "fake-token", user_id: "user123" });
    checkClinicMock.mockResolvedValueOnce(false); 

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "0712345678", name: "phone_number" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "mypassword", name: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/clinic_registration");
    });
  });

  it("shows error message if login hook reports error", () => {
    (useLogin as jest.Mock).mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: "Invalid credentials",
    });
    render(<LoginPage />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText("Password");
    const toggleButton = screen.getByRole("button", { name: /show password/i });
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: /show password/i })).toBeInTheDocument();
  });

  it("updates input fields correctly", () => {
    render(<LoginPage />);
    const phoneInput = screen.getByPlaceholderText("Phone number");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(phoneInput, { target: { value: "0712345678", name: "phone_number" } });
    fireEvent.change(passwordInput, { target: { value: "mypassword", name: "password" } });

    expect(phoneInput).toHaveValue("0712345678");
    expect(passwordInput).toHaveValue("mypassword");
  });

  it("disables login button when loading", () => {
    (useLogin as jest.Mock).mockReturnValue({
      login: jest.fn(),
      loading: true,
      error: null,
    });
    render(<LoginPage />);
    const button = screen.getByRole("button", { name: /logging in/i });
    expect(button).toBeDisabled();
  });

  it("renders Sign Up link correctly", () => {
    render(<LoginPage />);
    const link = screen.getByRole("link", { name: /Sign Up/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/signup");
  });
});
