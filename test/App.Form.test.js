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
jest.mock("../src/components/Todo"); // makes it undefined but tracked by mockImpl
jest.mock("../src/components/FilterButton"); // makes it undefined
// mock is automatically hoisted so that I create a separate file to test App with Form.

const tasks = [
  { name: "Eat", id: "todo-0" },
  { name: "Drink", id: "todo-1" },
];

describe("Form Integration test", () => {
  let mockTodo;

  beforeEach(() => {
    mockTodo = jest.fn((props) => "this is: " + props);
    Todo.mockImplementation((props) => {
      return mockTodo({
        name: props.name,
      });
    });
  });

  it("adds a task", async () => {
    render(<App tasks={tasks} />);

    expect(mockTodo).toHaveBeenCalledTimes(2);
    mockTodo.mockClear();
    await userEvent.type(screen.getByRole("textbox"), "new task");
    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(mockTodo).toHaveBeenCalledTimes(3);
    expect(mockTodo).toHaveBeenLastCalledWith({
      name: "new task",
    });
  });
});
