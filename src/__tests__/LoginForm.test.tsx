import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "@/components/LoginForm";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const loginMock = jest.fn();
jest.mock("../lib/auth", () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form", () => {
    render(<LoginForm />);
    expect(screen.getByText(/sign in/i)).toBeDefined();
    expect(screen.getByLabelText(/email address/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /login/i })).toBeDefined();
  });

  it("calls login and navigates on submit", () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    expect(loginMock).toHaveBeenCalledWith("test@example.com");
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });
});
