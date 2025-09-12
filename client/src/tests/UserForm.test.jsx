import { render, screen, fireEvent } from "@testing-library/react";
import UserForm from "../components/UserForm";

// Shows correct signup form
test("signup form shows confirm password field", () => {
  render(<UserForm mode="signup" />);
  expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
  expect(screen.getByText(/sign up/i)).toBeInTheDocument();
});

// Shows correct login form
test("login form does not show confirm password field", () => {
  render(<UserForm mode="login" />);
  expect(screen.queryByPlaceholderText(/confirm password/i)).not.toBeInTheDocument();
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});

// Shows the passwords do not match error message on signup
test("shows error when passwords do not match on signup", () => {
  render(<UserForm mode="signup" />);
  fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "12345678" } });
  fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "87654321" } });
  fireEvent.submit(screen.getByRole("signup-form"));
  expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
});
