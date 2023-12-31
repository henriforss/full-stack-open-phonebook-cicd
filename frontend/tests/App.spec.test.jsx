import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, test, vi } from "vitest";
import App from "../src/App";
import axiosMock from "axios";
import { act } from "react-dom/test-utils";

vi.mock("axios");

describe("App", () => {
  it("fetches data", async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: [
        {
          name: "Jesus",
          number: "123-12345",
          id: "6257eb1c0476839042d93123",
        },
      ],
    });

    await act(async () => {
      render(<App />);
    });

    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(axiosMock.get).toHaveBeenCalledWith("/api/persons");
  });

  it("shows title", async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: [
        {
          name: "Jesus",
          number: "123-12345",
          id: "6257eb1c0476839042d93123",
        },
      ],
    });

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText("Phonebook")).toBeInTheDocument();
  });
});
