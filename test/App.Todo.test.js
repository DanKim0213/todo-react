import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import App from "../src/App";

jest.mock("nanoid", () => {
  return {
    nanoid: jest.fn(),
  };
});
jest.mock("../src/components/FilterButton");
jest.mock("../src/components/Form");

const tasks = [
  { name: "Eat", id: "todo-0", completed: false },
  { name: "Drink", id: "todo-1", completed: true },
];

describe("Todo Integration test", () => {
  it("renders todo", () => {
    render(<App tasks={tasks} />);

    // Instead of checkbox, label is much better
    // since upcoming tests are based on labels
    const $labels = screen.getAllByLabelText(/eat|drink/i);

    expect($labels).toHaveLength(2);
  });

  it("makes an active task completed", async () => {
    render(<App tasks={tasks} />);

    const $activeTodos = screen.getAllByRole("checkbox", { checked: false });
    await userEvent.click($activeTodos[0]);

    expect($activeTodos[0]).toBeChecked();
  });

  it("makes a completed task active", async () => {
    render(<App tasks={tasks} />);

    const $completedTodos = screen.getAllByRole("checkbox", { checked: true });
    await userEvent.click($completedTodos[0]);

    expect($completedTodos[0]).not.toBeChecked();
  });

  it("deletes a task", async () => {
    render(<App tasks={tasks} />);

    const $buttons = screen
      .getByLabelText(/drink/i)
      .closest("li")
      .querySelectorAll("button");
    const $deleteButton = Array.from($buttons).find((el) =>
      new RegExp(/delete/i).test(el.textContent)
    );
    await userEvent.click($deleteButton);
    const $drinklabel = screen.queryByLabelText(/drink/i);

    expect($drinklabel).not.toBeInTheDocument();
  });

  it("edits and save a task", async () => {
    render(<App tasks={tasks} />);

    const $buttons = screen
      .getByLabelText(/drink/i)
      .closest("li")
      .querySelectorAll("button");
    const $editButton = Array.from($buttons).find((el) =>
      new RegExp(/edit/i).test(el.textContent)
    );
    await userEvent.click($editButton);
    await userEvent.type(screen.getByRole("textbox"), "edited Task");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    const $drinkLabel = screen.queryByLabelText(/drink/i);
    const $labels = screen.getAllByLabelText(/eat|edited task/i);

    expect($drinkLabel).not.toBeInTheDocument();
    expect($labels).toHaveLength(2);
  });

  it("edits and cancel a task", async () => {
    render(<App tasks={[tasks[0]]} />);

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    await userEvent.type(screen.getByRole("textbox"), "edited Task");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    const $label = screen.queryByLabelText("edited Task");

    expect($label).not.toBeInTheDocument();
  });

  it("focuses on Heading when it deletes a task", async () => {
    render(<App tasks={tasks} />);

    await userEvent.click(
      screen.getAllByRole("button", { name: /delete/i })[tasks.length - 1]
    );
    const $title = screen.getByRole("heading", { name: /remaining/i });

    expect($title).toHaveFocus();
  });
});
