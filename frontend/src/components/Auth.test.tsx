import { render, fireEvent } from "@testing-library/react";
import Auth from "./Auth";

import { SERVER_HOSTNAME } from "../lib/config";

// Mock the redirect function
jest.mock("../lib/utils", () => ({
  redirect: jest.fn(),
}));

describe("Auth Component", () => {
  it("renders the component correctly", () => {
    const { getByText, getByRole } = render(<Auth />);

    // Check if the component's title and button are rendered
    expect(getByText("Login with Github to start")).toBeInTheDocument();
    expect(getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("calls the redirect function when the 'Login' button is clicked", () => {
    const { getByRole } = render(<Auth />);
    const loginButton = getByRole("button", { name: "Login" });

    fireEvent.click(loginButton);

    // Verify that the redirect function was called with the expected URL
    expect(require("../lib/utils").redirect).toHaveBeenCalledWith(
      `${SERVER_HOSTNAME}/auth/github`
    );
  });
});
