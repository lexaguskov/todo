import { render, fireEvent } from "@testing-library/react";
import Auth from "./Auth";

import { SERVER_HOSTNAME } from "../lib/config";

// Mock the redirect function
jest.mock("../lib/utils", () => ({
  redirect: jest.fn(),
}));

describe("Auth Component", () => {
  it("renders the component correctly", () => {
    const screen = render(<Auth />);

    // Check if the component's title and button are rendered
    expect(screen.getByText("Login with Github to start")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("calls the redirect function when the 'Login' button is clicked", () => {
    const screen = render(<Auth />);
    const loginButton = screen.getByRole("button", { name: "Login" });

    fireEvent.click(loginButton);

    // Verify that the redirect function was called with the expected URL
    expect(require("../lib/utils").redirect).toHaveBeenCalledWith(
      `${SERVER_HOSTNAME}/auth/github`
    );
  });
});
