import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import App from "../src/App";
import MockTodo from "../src/components/Todo";

jest.mock("nanoid", () => {
  return {
    nanoid: jest.fn(),
  };
});
jest.mock("../src/components/Todo");
jest.mock("../src/components/Form");

const tasks = [
  { name: "Eat", id: "todo-0", completed: false },
  { name: "Drink", id: "todo-1", completed: true },
];

describe("Filter Integration test", () => {
  afterEach(() => {
    MockTodo.mockClear();
  });

  it("filters tasks by All initially", async () => {
    render(<App tasks={tasks} />);

    expect(MockTodo).toHaveBeenCalledTimes(2);
    const $filter = screen.getByRole("button", { pressed: true });

    expect($filter).toHaveTextContent(/all/i);
  });

  it("changes the filter to show only completed tasks", async () => {
    MockTodo.mockImplementation((props) =>
      JSON.stringify({
        id: props.id,
        name: props.name,
        completed: props.completed,
      })
    );
    render(<App tasks={tasks} />);

    expect(MockTodo).toHaveBeenCalledTimes(2);
    MockTodo.mockClear();
    const $filter = screen.getByRole("button", { name: /complete/i });
    await userEvent.click($filter);

    expect(MockTodo).toHaveReturnedWith(
      JSON.stringify({
        id: tasks[1].id,
        name: tasks[1].name,
        completed: tasks[1].completed,
      })
    );
  });
});
