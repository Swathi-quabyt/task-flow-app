import  { useState } from "react";
import { useSelector } from "react-redux";
import {
  TextField,
  Dialog,
  DialogTitle,
  Button,
  List as MUIList,
  ListItem,
  ListItemText,
} from "@mui/material";
import { selectAllTasks } from "../slices/boardSlice";

const SearchTasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const allTasks = useSelector(selectAllTasks);

  // Filter tasks based on the search term
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
    <div>
      <TextField
        label="Search Tasks"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
      />
      
      {/* Button to initiate search and display results */}
      <Button variant="contained" color="primary" onClick={handleSearchClick}>
        Search
      </Button>

      {/* Dialog to display search results */}
      <Dialog open={showResults} onClose={handleCloseDialog}>
        <DialogTitle>Search Results</DialogTitle>
        <MUIList>
          {filteredTasks.map((task) => (
            <ListItem
              key={task.id}
              button
              onClick={() => handleTaskClick(task)}
            >
              <ListItemText primary={task.title} />
            </ListItem>
          ))}
        </MUIList>
      </Dialog>

      {/* Dialog for selected task */}
      {selectedTask && (
        <Dialog open={Boolean(selectedTask)} onClose={handleCloseDialog}>
          <DialogTitle>Hi Sweety</DialogTitle>
          <div style={{ padding: "10px" }}>
            <p>You clicked on: {selectedTask.title}</p>
            <Button variant="contained" color="primary" onClick={handleCloseDialog}>
              Close
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default SearchTasks;
