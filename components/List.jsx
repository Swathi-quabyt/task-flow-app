import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { addTaskToBackend, removeList } from "../slices/boardSlice";
import TaskCard from "./TaskCard";
import { Button, TextField, IconButton } from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";

import { Delete as DeleteIcon } from "@mui/icons-material";

// The List component displays tasks and allows adding new tasks
const List = ({ list, index }) => {
  console.log("Received index:", index);
  const dispatch = useDispatch();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  useEffect(() => {
    console.log("List component re-rendered with updated state:", list.tasks);
  }, [list.tasks]);

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== "") {
      const newTask = {
        id: nanoid(),
        title: newTaskTitle,
        description: newTaskDescription,
        duedate: newDueDate,
      };
      console.log("Dispatching task to list:", index);
      console.log("Tasks updated:", list.tasks, index);
      console.log("Board state after addTask:", list);
      console.log("Dispatching addTaskToBackend with:", newTask);
      dispatch(addTaskToBackend({ listId: index, task: newTask }));
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewDueDate("");
    }
  };

  const handleRemoveList = () => {
    dispatch(removeList(index)); // Dispatch the removeList action
  };

  // This effect logs changes to `list.tasks` and triggers re-render when tasks change

  // Dependency array ensures this runs when `list.tasks` changes

  return (
    <div className="bg-white p-4 rounded-md shadow-md border-2 shadow-blue-950  min-w-[200px]">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold mb-4">{list.title}</h3>
        <IconButton onClick={handleRemoveList} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </div>
      <div className="space-y-2 ">
        {list.tasks.map((task) => (
          <TaskCard
            key={task.id}
            listId={index}
            task={task}
            taskindex={task.id}
          />
        ))}
      </div>
      <div className="mt-4  ">
        <TextField
          label="New Task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          size="small"
        />
        <div className="mt-4 mb-4 w-full">
          <TextField
            label="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            size="small"
          />
        </div>
        <TextField
          label="YYYY-MM-DD"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          size="small"
        />

        <div className="  hover:bg-slate-400 border-2 border-black w-2/6 mt-2 bg-gray-100 ">
          <Button onClick={handleAddTask}>Add Task</Button>
        </div>
      </div>
    </div>
  );
};

// Define prop types for validation
List.propTypes = {
  list: PropTypes.shape({
    // Allowing both string and number
    title: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // list must have a specific shape
};
export default List;
