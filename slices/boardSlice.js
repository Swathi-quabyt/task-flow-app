import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL_FOR_JSON_DATA = "http://localhost:3001";

// Asynchronous thunk to fetch board data from JSON Server
export const fetchBoard = createAsyncThunk("board/fetchBoard", async () => {
  const response = await axios.get(`${BASE_URL_FOR_JSON_DATA}/board`);
  return response.data;
});

// Find a specific list within the board by its ID
export const findListById = (board, listId) => {
  const list = board.lists.find((l) => l.id === listId);

  if (!list) {
    throw new Error(`List with ID ${listId} not found`);
  }

  return list;
};

// Async thunk to add a new task to a specific list
export const addTaskToBackend = createAsyncThunk(
  'board/addTaskToBackend',
  async ({ listId, task }) => {
    const response = await axios.post(`${BASE_URL_FOR_JSON_DATA}/board/lists/${listId}/tasks`, task);
    return response.data; // Return the added task
  }
);

let uniqueIdCounter = 0;

const getUniqueId = () => {
  uniqueIdCounter += 1;
  return uniqueIdCounter;
};
const initialState = {
  title: "",
  lists: [],
  status: "idle",
  error: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addList: (state, action) => {
      state.lists.push({
        id: getUniqueId(),
        title: action.payload.title,
        tasks: [],
      });
    },
    removeList: (state, action) => {
      // Find the index of the list to be removed
      const listIndex = state.lists.findIndex((l) => l.id === action.payload);
      if (listIndex !== -1) {
        state.lists.splice(listIndex, 1); // Remove the list from the state
      }
    },
    editTask: (state, action) => {
      const { listId, taskId, newTitle, newDescription, newduedate } =
        action.payload;
      const list = state.lists.find((l) => l.id === listId);
      if (list) {
        const task = list.tasks.find((t) => t.id === taskId);
        if (task) {
          if (newTitle) task.title = newTitle;
          if (newDescription) task.description = newDescription;
          if (newduedate) task.dueDate = newduedate; // Ensure this is updating
        }
      }
    },
    removeTask: (state, action) => {
      const { listId, taskId } = action.payload;
      const list = state.lists.find((l) => l.id === listId);
      console.log("deleting task list  ID:", listId, taskId);
      if (list) {
        list.tasks = list.tasks.filter((task) => task.id !== taskId);
      }
    },
    addTask: (state, action) => {
      const { listId, task, duedatefortask } = action.payload;
      const listIndex = state.lists.findIndex((l) => l.id === listId);

      if (listIndex !== -1) {
        const updatedTask = {
          ...task,
          dueDate: duedatefortask, // Ensure duedatefortask is used
        };
        const updatedList = {
          ...state.lists[listIndex],
          tasks: [...state.lists[listIndex].tasks, updatedTask],
        };
        state.lists = state.lists.map((l, i) =>
          i === listIndex ? updatedList : l
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { title, lists } = action.payload;
        state.title = title;
        state.lists = lists;
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Add Selectors Here
// Selector to get all lists
export const selectLists = (state) => state.board.lists;

// Selector to get all tasks in a flattened array
export const selectAllTasks = createSelector([selectLists], (lists) =>
  lists.flatMap((list) => list.tasks)
);

export const { addList, removeTask, addTask, removeList, editTask } =
  boardSlice.actions;

export default boardSlice.reducer;
