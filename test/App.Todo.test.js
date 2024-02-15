import { render, screen, within } from "@testing-library/react";
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

    const $checkboxes = screen.getAllByRole("checkbox");

    expect($checkboxes).toHaveLength(2);
  });

  it("makes an active task completed", async () => {
    render(<App tasks={tasks} />);

    const $activeCheckboxes = screen.getAllByRole("checkbox", {
      checked: false,
    });
    await userEvent.click($activeCheckboxes[0]);

    expect($activeCheckboxes[0]).toBeChecked();
  });

  it("makes a completed task active", async () => {
    render(<App tasks={tasks} />);

    const $completedCheckboxes = screen.getAllByRole("checkbox", {
      checked: true,
    });
    await userEvent.click($completedCheckboxes[0]);

    expect($completedCheckboxes[0]).not.toBeChecked();
  });

  it("deletes a task", async () => {
    render(<App tasks={tasks} />);

    const $todo = screen.getByLabelText(/drink/i).closest("li");
    const $deleteButton = within($todo).getByRole("button", {
      name: /delete/i,
    });
    await userEvent.click($deleteButton);
    const $drinkCheckbox = screen.queryByLabelText(/drink/i);

    expect($drinkCheckbox).not.toBeInTheDocument();
  });

  it("edits and save a task", async () => {
    render(<App tasks={tasks} />);

    const $todo = screen.getByLabelText(/drink/i).closest("li");
    const $editButton = within($todo).getByRole("button", { name: /edit/i });
    await userEvent.click($editButton);
    await userEvent.type(screen.getByRole("textbox"), "edited Task");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    const $drinkCheckbox = screen.queryByLabelText(/drink/i);
    const $checkboxes = screen.getAllByRole("checkbox");

    expect($drinkCheckbox).not.toBeInTheDocument();
    expect($checkboxes).toHaveLength(2);
  });

  it("edits and cancel a task", async () => {
    render(<App tasks={tasks} />);

    const $todo = screen.getByLabelText(/drink/i).closest("li");
    const $editButton = within($todo).getByRole("button", { name: /edit/i });
    await userEvent.click($editButton);
    await userEvent.type(screen.getByRole("textbox"), "edited Task");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    const $drinkCheckbox = screen.queryByLabelText(/edited Task/);
    const $checkboxes = screen.getAllByRole("checkbox");

    expect($drinkCheckbox).not.toBeInTheDocument();
    expect($checkboxes).toHaveLength(2);
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
