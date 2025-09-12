import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Header from "../components/Header";
import { AuthContext } from "../components/AuthContext";
import { UIContext } from "../components/App";

// Helper function to render header with different UI values and user-status
function renderWithProviders(ui, { user = null, uiValues = {} } = {}) {
  const defaultUIValues = {
    hideMusicPlayer: false,
    setHideMusicPlayer: vi.fn(),
    hideSoundGrid: false,
    setHideSoundGrid: vi.fn(),
    resetVolumes: 0,
    setResetVolumes: vi.fn(),
  };

  return render(
    <AuthContext.Provider value={{ user }}>
      <UIContext.Provider value={{ ...defaultUIValues, ...uiValues }}>
        {ui}
      </UIContext.Provider>
    </AuthContext.Provider>
  );
}

// Test: renders correct login/signup buttons when no user
test("renders login/signup buttons when no user", () => {
  renderWithProviders(<Header />);
  expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  expect(screen.getByText(/log in/i)).toBeInTheDocument();
});

// Test: renders logout button when user
test("renders logout button when user", () => {
    renderWithProviders(<Header />, { user: true });
    expect(screen.getByText(/log out/i)).toBeInTheDocument();
});

// Test: black-screen toggles on/off
test("clicking sun/moon enters/exits night mode", () => {
  renderWithProviders(<Header />);
  fireEvent.click(screen.getByAltText(/toggle night mode on/i));
  expect(document.querySelector(".black-screen")).toBeInTheDocument();
  fireEvent.click(screen.getByAltText(/toggle night mode off/i));
  expect(document.querySelector(".black-screen")).not.toBeInTheDocument();
});

// Test: Show signup form
test("shows signup form when clicking SIGN UP", () => {
  renderWithProviders(<Header />);
  fireEvent.click(screen.getByText(/sign up/i));
  expect(screen.getByRole('signup-form')).toBeInTheDocument();
});

// Test: Show login form
test("shows login form when clicking LOG IN", () => {
  renderWithProviders(<Header />);
  fireEvent.click(screen.getByText(/log in/i));
  expect(screen.getByRole('login-form')).toBeInTheDocument();
});

// Test: Show the options menu
test("clicking the options button shows the options menu", () => {
    renderWithProviders(<Header />);
    fireEvent.click(screen.getByAltText(/options/i));
    expect(document.querySelector(".options-menu")).toBeInTheDocument();
});

// Test: hide/show ui elements when clicking options
test("clicking hide music player calls setHideMusicPlayer", () => {
  const setHideMusicPlayer = vi.fn();
  renderWithProviders(<Header />, {
    uiValues: { setHideMusicPlayer }
  });

  fireEvent.click(screen.getByAltText(/options/i));
  fireEvent.click(screen.getByText(/hide music player/i));

  expect(setHideMusicPlayer).toHaveBeenCalled();
});
