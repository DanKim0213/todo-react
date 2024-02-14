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

    const $title = screen.getByLabelText(/to be done/i);
    expect($title).toBeInTheDocument();

    const $textbox = screen.getByRole("textbox");
    expect($textbox).toBeInTheDocument();

    const $button = screen.getByRole("button");
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
