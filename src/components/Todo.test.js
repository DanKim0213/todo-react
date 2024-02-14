import { screen, render } from "@testing-library/react";
import Todo from "./Todo";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Todo", () => {
  it("renders Todo component", () => {
    render(<Todo name="Eat" id="todo-0" />);

    const $taskLabel = screen.getByLabelText(/eat/i);

    expect($taskLabel).toBeInTheDocument();
  });

  it("edits a task", async () => {
    render(<Todo name="Eat" id="todo-0" />);

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    const $textbox = screen.getByRole("textbox");
    await userEvent.type($textbox, "drink");

    expect($textbox).toHaveValue("drink");
  });

  it("deletes a task", async () => {
    const deleteTask = jest.fn();
    render(<Todo name="Eat" id="todo-0" deleteTask={deleteTask} />);

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(deleteTask).toHaveBeenCalledTimes(1);
  });

  it("completes a task", async () => {
    const toggleTaskCompleted = jest.fn();
    render(
      <Todo name="Eat" id="todo-0" toggleTaskCompleted={toggleTaskCompleted} />
    );

    await userEvent.click(screen.getByRole("checkbox"));

    expect(toggleTaskCompleted).toHaveBeenCalledTimes(1);
  });

  it("focuses on the connected input when editing", async () => {
    render(<Todo name="Eat" id="todo-0" />);

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    const $textbox = screen.getByRole("textbox");

    expect($textbox).toHaveFocus();
  });

  it("focuses on the edit button when editing is canceled", async () => {
    render(<Todo name="Eat" id="todo-0" />);

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    const $editButton = screen.getByRole("button", { name: /edit/i });

    expect($editButton).toHaveFocus();
  });

  it("does not focuses on any element initially", () => {
    render(<Todo name="Eat" id="todo-0" />);

    const $focusedButtons = screen.getAllByRole("button");
    const $focusedCheckboxs = screen.getAllByRole("checkbox");

    $focusedButtons.forEach(($btn) => expect($btn).not.toHaveFocus());
    $focusedCheckboxs.forEach(($btn) => expect($btn).not.toHaveFocus());
  });
});
