import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/components/LoginForm";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const loginMock = jest.fn();
const registerMock = jest.fn();
jest.mock("../lib/auth", () => ({
  useAuth: () => ({
    login: loginMock,
    register: registerMock,
  }),
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    loginMock.mockResolvedValue({ uid: "123", email: "test@example.com", role: "user" });
    registerMock.mockResolvedValue({ uid: "123", email: "test@example.com", role: "user" });
  });

  it("renders the login form", () => {
    render(<LoginForm />);
    expect(screen.getByText(/sign in/i)).toBeDefined();
    expect(screen.getByLabelText(/email address/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /login/i })).toBeDefined();
  });

  it("calls login with email and password on submit", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("test@example.com", "password123");
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("switches to registration mode", () => {
    render(<LoginForm />);

    const createAccountLink = screen.getByText(/create account/i);
    fireEvent.click(createAccountLink);

    expect(screen.getByRole("heading", { name: /create account/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /create account/i })).toBeDefined();
  });

  it("calls register when in registration mode", async () => {
    render(<LoginForm />);

    const createAccountLink = screen.getByText(/create account/i);
    fireEvent.click(createAccountLink);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: "newuser@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith("newuser@example.com", "password123");
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });
});
