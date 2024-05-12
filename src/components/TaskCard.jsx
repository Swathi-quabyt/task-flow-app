import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  deleteTaskFromList,
  editTaskInList,
  addLabelToTask,
  deleteLabelFromTask,
} from "../slices/boardSlice";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";

const TaskCard = ({ listId, task, taskindex, boardId, label }) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [taskDueDate, setTaskDueDate] = useState(task.duedate);

  const [labels, setLabels] = useState(label || []);
  const [newLabel, setNewLabel] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {}, [dispatch]);

  const handleDelete = () => {
    dispatch(
      deleteTaskFromList({
        boardId: boardId,
        listId: listId,
        taskId: taskindex,
      })
    );
  };

  console.log("datee", task.description, task.duedate);
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditSubmit = () => {
    const updatedTaskData = {
      title: taskTitle,
      description: taskDescription,
      duedate: taskDueDate,
      labeloftasks: labels,
    };
    dispatch(
      editTaskInList({ boardId, listId, taskId: taskindex, updatedTaskData })
    );
    setIsEditing(false);
  };

  const handleAddLabel = () => {
    const trimmedLabel = newLabel.trim();
    if (trimmedLabel !== "") {
      dispatch(
        addLabelToTask({
          boardId,
          listId,
          taskId: taskindex,
          label: trimmedLabel,
        })
      );
      console.log("Labels state updated:", label);
      setLabels([...labels, trimmedLabel]);
      console.log("tr-tr", trimmedLabel);
      console.log("after adding label", labels);
      setNewLabel("");
    }
  };

  const handleDeleteLabel = (index) => {
    dispatch(
      deleteLabelFromTask({
        boardId,
        listId,
        taskId: taskindex,
        labelIndex: index,
      })
    );
    const updatedLabels = [...labels];
    updatedLabels.splice(index, 1);
    setLabels(updatedLabels);
  };
  return (
    <>
      <Card
        sx={{
          backgroundColor: theme.palette.grey[50],
          maxWidth: "390px",
          minWidth: "390px",
          maxHeight: "300px",
          margin: "20px",

          borderColor: "var(--color-border)",
          borderRadius: "5px",
        }}
      >
        <CardContent>
          <Box className="border-l-4 border-red-500">
            <div className="flex justify-between items-center  p-4">
              <Typography variant="h6" className="flex-grow">
                {task.title}
              </Typography>

              <div className="flex items-center  ">
                <IconButton
                  onClick={handleEditToggle}
                  size="large"
                  color="secondary"
                >
                  <EditIcon />
                </IconButton>
                <Button
                  size="medium"
                  color="secondary"
                  onClick={handleDelete}
                  startIcon={<DeleteIcon />}
                ></Button>
              </div>
            </div>
            <Typography
              variant="body2"
              sx={{
                padding: "10px 10px 10px 20px",
                textAlign: "left",
                fontWeight: 600,
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
                fontWeight: 600,
              }}
            >
              Due date: {task.duedate}
            </Typography>

            <Box>
              {labels.map((labele, index) => (
                <Chip
                  key={index}
                  label={labele}
                  onDelete={() => handleDeleteLabel(index)}
                  style={{ margin: "2px" }}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={isEditing}
        onClose={handleEditToggle}
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
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { fontWeight: 600 } }}
          />
          <TextField
            label="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { fontWeight: 600 } }}
          />
          <TextField
            label=""
            type="date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { fontWeight: 600 } }}
          />

          <Box>
            <TextField
              label="Add Label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { fontWeight: 600 } }}
              onKeyDown={(e) => e.key === "Enter" && handleAddLabel()}
            />
            <Button
              variant="contained"
              onClick={handleAddLabel}
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Add Label
            </Button>
          </Box>
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
  boardId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  listId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  task: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    duedate: PropTypes.string,
  }).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  taskindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default TaskCard;
