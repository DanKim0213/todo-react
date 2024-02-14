import { render, screen } from "@testing-library/react";
import FilterButton from "./FilterButton";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Filter Button", () => {
  it("renders Filter Button", () => {
    render(<FilterButton name={"All"} />);
    const $button = screen.getByRole("button");
    expect($button).toHaveTextContent(/All/i);
  });

  it("sets to this filter", async () => {
    const setFilter = jest.fn();
    render(<FilterButton name={"All"} setFilter={setFilter} />);

    const $button = screen.getByRole("button", { name: /all/i });
    expect($button).toBeInTheDocument();
    await userEvent.click($button);

    expect(setFilter).toHaveBeenCalled();
  });
});
