import { render, screen } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

jest.mock("nanoid", () => {
  return {
    nanoid: jest.fn(),
  };
});

const tasks = [
  { name: "Eat", id: "todo-0" },
  { name: "Drink", id: "todo-1" },
];

describe("App component", () => {
  it("renders App component", () => {
    render(<App tasks={tasks} />);

    const $heading = screen.getByRole("heading", { level: 1 });
    // screen.debug();

    expect($heading).toHaveTextContent(/todomatic/i);
  });
});
