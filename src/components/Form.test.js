import { screen, render } from "@testing-library/react";
import Form from "./Form";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Form", () => {
  let addTask;
  beforeEach(() => {
    addTask = jest.fn();
  });

  it("renders From component", () => {
    render(<Form />);

    const $textbox = screen.getByRole("textbox");
    const $button = screen.getByRole("button");

    expect($textbox).toBeInTheDocument();
    expect($button).toBeInTheDocument();
  });

  it("does not allow to add a task with an empty string", async () => {
    render(<Form addTask={addTask} />);

    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    const $textbox = screen.getByRole("textbox");

    expect(addTask).not.toHaveBeenCalledTimes(1);
    expect($textbox).toHaveClass(/alert/);
  });

  it("adds a task", async () => {
    render(<Form addTask={addTask} />);

    await userEvent.type(screen.getByRole("textbox"), "Hello from test!");
    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(addTask).toHaveBeenCalledTimes(1);
  });
});
