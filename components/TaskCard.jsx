import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeTask, editTask } from "../slices/boardSlice";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

const TaskCard = ({ listId, task, taskindex }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [taskDueDate, setTaskDueDate] = useState(task.dueDate);
  const dispatch = useDispatch();

  const handleDelete = () => {
    console.log("Deleting task with ID:", taskindex, "from list:", listId);
    dispatch(removeTask({ listId, taskId: taskindex }));
  };

  // Toggle edit mode (opens the dialog)
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e) => {
    setTaskTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };
  const handleDueDateChange = (e) => {
    setTaskDueDate(e.target.value);
  };

  const handleEditSubmit = () => {
    dispatch(
      editTask({
        listId,
        taskId: taskindex,
        newTitle: taskTitle,
        newDescription: taskDescription,
        newduedate: taskDueDate,
      })
    );
    setIsEditing(false); // Close the dialog after editing
  };

  return (
    <>
      <Card
        sx={{
          backgroundColor: "white",
          maxWidth: "300px",
          minWidth: "300px",
          maxHeight: "250px",
          margin: "20px",
          border: "1px solid",
          borderColor: "var(--color-border)",
          borderRadius: "5px",
        }}
      >
        <CardContent>
         
          <Box className="border-l-8 border-red-500 p-4">
            <Typography variant="h6">{task.title}</Typography>
            <Typography
              variant="body2"
              sx={{
                padding: "10px 10px 10px 20px",
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {task.description}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                padding: "10px 10px 10px 20px",
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              DUE: {task.dueDate}
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <IconButton onClick={handleEditToggle} size="small">
            <EditIcon />
          </IconButton>
          <Button size="small" color="secondary" onClick={handleDelete}>
            Delete
          </Button>
        </CardActions>
      </Card>

      {/* Dialog for editing the task */}
      <Dialog open={isEditing} onClose={handleEditToggle}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <div className="mt-4 mb-4 ">
            <TextField
              label="Task Title"
              value={taskTitle}
              onChange={handleEditChange}
              fullWidth
            />
          </div>
          <div>
            <TextField
              label="Task Description"
              value={taskDescription}
              onChange={handleDescriptionChange}
              fullWidth
            />
          </div>
          <div className="mt-4">
            <TextField
              label="Due Date"
              value={taskDueDate}
              onChange={handleDueDateChange}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditToggle} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

TaskCard.propTypes = {
  listId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  task: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    dueDate: PropTypes.string,
  }).isRequired,
  taskindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default TaskCard;
