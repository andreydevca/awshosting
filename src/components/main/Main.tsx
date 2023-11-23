"use client";
import { FormEvent, useEffect, useState } from "react";

type Props = {};
type Todo = {
  _id: string;
  task: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Main = (props: Props) => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");

  //FETCHING TODOS
  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/todo`);
      const todos = await res.json();
      setTodo(todos?.data);
    } catch (error) {
        console.log('error fetching todos')
    }
  };

  //SUBMITTING NEW TODO
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return setInput("");
    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: input }),
      })
      const data = await result.json()
      const newTodos = [...todo, data?.data]
      setTodo(newTodos);
    } catch (error) {
      console.log('error adding todo')
    }
    setInput("");
  };


  return (
    <div>
      <h1 className="text-[2rem]">Best Todo App</h1>
      <form onSubmit={handleSubmit} className="mt-5 select-none">
        <input
          placeholder="Enter todo"
          className="border-[1px] p-2 rounded-sm"
          name="todo"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        ></input>
        <button
          type="submit"
          className="p-2 bg-yellow-400 rounded-sm ml-2 text-white"
        >
          Add todo
        </button>
      </form>
      <div className="mt-[2rem]">
        {todo.length > 0
          ? todo.map((item) => {
            const date = new Date(item.createdAt)
            const formattedDate = date.toLocaleDateString('en-US')
            const time = date.toLocaleTimeString('en-US')
              return (
                <div
                  className="bg-blue-100 p-4 rounded-md mb-2 max-w-[400px] flex-wrap"
                  key={Math.ceil(Math.random() * 10000) + item?.task}
                >
                  <p className="font-[500] text-gray-600 break-all">{item.task}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created at: {formattedDate}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {time}
                  </p>
                </div>
              );
            })
          : "No todos to display"}
      </div>
    </div>
  );
};

export default Main;
