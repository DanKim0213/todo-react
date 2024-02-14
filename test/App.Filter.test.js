import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import App from "../src/App";
import Todo from "../src/components/Todo";

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
  let mockTodo;

  beforeEach(() => {
    mockTodo = jest.fn((props) => "this is: " + props);
    Todo.mockImplementation((props) => {
      return mockTodo({
        id: props.id,
        name: props.name,
        completed: props.completed,
      });
    });
  });

  it("filters tasks by All initially", async () => {
    render(<App tasks={tasks} />);

    expect(mockTodo).toHaveBeenCalledTimes(2);
    const $filter = screen.getByRole("button", { pressed: true });

    expect($filter).toHaveTextContent(/all/i);
  });

  it("changes the filter to show only completed tasks", async () => {
    render(<App tasks={tasks} />);

    expect(mockTodo).toHaveBeenCalledTimes(2);
    mockTodo.mockClear();
    const $filter = screen.getByRole("button", { name: /complete/i });
    await userEvent.click($filter);

    expect(mockTodo).toHaveBeenCalledWith(tasks[1]);
  });
});
