import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { removeListFromBoard, addTaskToList,updateListTitle } from "../slices/boardSlice"; // Redux actions
import TaskCard from "./TaskCard";
import {
  Button,
  Tooltip,
  TextField,
  Box,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";

import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";

const List = ({ list, index, boardid }) => {
  const dispatch = useDispatch();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode for list title
  const [editedListTitle, setEditedListTitle] = useState(list.title); // State to hold edited list title

  useEffect(() => {
    console.log("List component re-rendered with updated state:", list.tasks);
  }, [list.tasks,editedListTitle]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleEditListTitle = () => {
    setIsEditing(true);
  };

  const handleSaveListTitle = () => {
    if (editedListTitle.trim() !== "") {
      console.log('ee',boardid,index,editedListTitle)
      dispatch(updateListTitle({ boardId: boardid, listId: index, newTitle: editedListTitle }));
      console.log('ee',boardid,index,editedListTitle)
    } else {
      // If the edited title is empty, revert to the original title
      
    }
    setIsEditing(false);
  };

  const handleListTitleChange = (e) => {
    setEditedListTitle(e.target.value);
  };



  const handleAddTask = () => {
    if (newTaskTitle.trim() !== "") {
      const newTask = {
        id: nanoid(),
        title: newTaskTitle,
        description: newTaskDescription,
        duedate: newDueDate,
      };
      console.log("neww", newTask);
      dispatch(
        addTaskToList({
          boardId: boardid,
          listId: index,
          newTask,
        })
      );

      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewDueDate("");
    }
  };

  const handleRemoveList = () => {
    dispatch(removeListFromBoard({ boardId: boardid, listId: index }));
  };

  return (
    <div className=" p-4 rounded-lg  border-2 ">
      <div className="flex justify-between items-center">
        {/* <h3 className="text-xl font-semibold mb-4">{list.title}</h3> */}


        {isEditing ? (
          <TextField
            value={editedListTitle}
            onChange={handleListTitleChange}
            onBlur={handleListTitleChange}
            autoFocus
          />
        ) : (
          <h3 className="text-xl font-semibold mb-4" onClick={handleEditListTitle}>
            {list.title}
          </h3>
        )}

        <div className="flex space-x-2">

        {isEditing ? (
            <Tooltip title="Save" arrow>
              <IconButton onClick={handleSaveListTitle} aria-label="save" size="medium">
                <SaveIcon color="primary" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Edit List Title" arrow>
              <IconButton onClick={handleEditListTitle} aria-label="edit" size="medium">
                <EditIcon color="secondary" />
              </IconButton>
            </Tooltip>
          )}


          <Tooltip title="Delete List" arrow>
            <IconButton
              onClick={handleRemoveList}
              aria-label="delete"
              size="medium"
            >
              <DeleteIcon color="secondary" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Task" arrow>
            <IconButton
              onClick={handleOpenDialog}
              aria-label="add"
              size="medium"
            >
              <AddIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {/* Drag and drop context */}

      <div className="space-y-2 ">
        {list.tasks.map((task) => (
          <TaskCard
            key={task.id}
            listId={index}
            task={task}
            taskindex={task.id}
            boardId={boardid}
            duedate={task.duedate}
            label={task.labels}
          />
        ))}
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth={true}
      >
        <Box sx={{ paddingBottom: "5px" }}>
          <DialogTitle>Edit Task</DialogTitle>
        </Box>
        <DialogContent
          sx={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            fullWidth
          />
          <TextField
            label=""
            value={newDueDate}
            type="date"
            onChange={(e) => setNewDueDate(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddTask} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

List.propTypes = {
  boardid: PropTypes.number.isRequired,
  list: PropTypes.shape({
    title: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default List;
