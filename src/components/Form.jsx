import { useState } from "react";

function Form(props) {
  const [name, setName] = useState("");
  const [isEmpty, setEmpty] = useState(false); // isEmpty is enabled when to add a todo

  // NOTE: As written, this function has a bug: it doesn't prevent the user
  // from submitting an empty form. This is left as an exercise for developers
  // working through MDN's React tutorial.
  function handleSubmit(event) {
    event.preventDefault();
    if (name.trim().length === 0) {
      setEmpty(true);
      return;
    }

    setEmpty(false);
    props.addTask(name);
    setName("");
  }

  function handleChange(event) {
    setName(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>

      <input
        type="text"
        id="new-todo-input"
        className={`input input__lg ${isEmpty && "alert"}`}
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
