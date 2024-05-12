import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  TextField,
  Dialog,
  DialogTitle,
  Button,
  List as MUIList,
  ListItem,
  ListItemText,
} from "@mui/material";
import { fetchBoard } from "../slices/boardSlice";

const SearchTasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const dispatch = useDispatch();

  const allboards = useSelector((state) => {
    return state.board.boards;
  });

  useEffect(() => {
    dispatch(fetchBoard());
  }, [dispatch]);

  // Extract all tasks from all boards
  const allTasks = allboards.flatMap((board) =>
    board.lists.flatMap((list) =>
      list.tasks.map((task) => ({
        ...task,
        boardTitle: board.title,
        listTitle: list.title,
      }))
    )
  );

  const filteredTasks = allTasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchClick = () => {
    setShowResults(true);
  };

  const handleCloseDialog = () => {
    setShowResults(false);
    setSelectedTask(null);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  return (
    <>
      <div>
        <TextField
          label="Search Tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
        />

        <Button
          variant="contained"
          color="secondary"
          onClick={handleSearchClick}
          sx={{ ml: 2 }}
        >
          Search
        </Button>

        <Dialog open={showResults} onClose={handleCloseDialog}>
          <DialogTitle>Search Results</DialogTitle>
          <MUIList>
            {filteredTasks.map((task) => (
              <ListItem
                key={task.id}
                button
                onClick={() => handleTaskClick(task)} // Open task details dialog
              >
                <ListItemText
                  primary={task.title}
                  secondary={`Board: ${task.boardTitle}, List: ${task.listTitle}`} // Display which board and list the task belongs to
                />
              </ListItem>
            ))}
          </MUIList>
        </Dialog>

        {selectedTask && (
          <Dialog open={Boolean(selectedTask)} onClose={handleCloseDialog}>
            <DialogTitle>Task Details</DialogTitle>
            <div style={{ padding: "10px" }}>
              <p>Task Title: {selectedTask.title}</p>
              <p>Board: {selectedTask.boardTitle}</p>
              <p>List: {selectedTask.listTitle}</p>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseDialog}
              >
                Close
              </Button>
            </div>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default SearchTasks;
