import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL_FOR_JSON_DATA = "http://localhost:3001";

// Asynchronous thunk to fetch board data from JSON Server
export const fetchBoard = createAsyncThunk("board/fetchBoard", async () => {
  console.log("Dispatching fetchBoard...");
  const response = await axios.get(`${BASE_URL_FOR_JSON_DATA}/boards`);
  console.log("Fetched boards..:", response.data);
  return response.data;
});

// Asynchronous thunk to delete label from task
export const deleteLabelFromTask = createAsyncThunk(
  "board/deleteLabelFromTask",
  async ({ boardId, listId, taskId, labelIndex }) => {
    try {
      const response = await axios.get(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`
      );
      const board = response.data;
      const targetList = board.lists.find((list) => list.id === listId);

      if (!targetList) {
        throw new Error(`List with ID ${listId} not found`);
      }
      const targetTask = targetList.tasks.find((task) => task.id === taskId);
      if (!targetTask) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      targetTask.labels.splice(labelIndex, 1);
      await axios.put(`${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`, board);
      return { boardId, listId, taskId, labelIndex };
    } catch (error) {
      console.error("Error deleting label from task:", error.message);
      throw error;
    }
  }
);

// Asynchronous thunk for adding label to tasks
export const addLabelToTask = createAsyncThunk(
  "board/addLabelToList",
  async ({ boardId, listId, taskId, label }) => {
    try {
      const response = await axios.get(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`
      );
      const board = response.data;
      const targetList = board.lists.find((list) => list.id === listId);
      if (!targetList) {
        throw new Error(`List with ID ${listId} not found`);
      }
      const targetTask = targetList.tasks.find((task) => task.id === taskId);
      if (!targetTask) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      targetTask.labels = targetTask.labels || [];
      targetTask.labels.push(label);
      await axios.put(`${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`, board);
      return { boardId, listId, taskId, label };
    } catch (error) {
      console.error("Error adding label to task:", error.message);
      throw error;
    }
  }
);

// Async thunk to edit a task within a specific list and board
export const editTaskInList = createAsyncThunk(
  "board/editTaskInList",
  async ({ boardId, listId, taskId, updatedTaskData }) => {
    try {
      const response = await axios.get(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`
      );
      const board = response.data;
      const targetList = board.lists.find((list) => list.id === listId);
      console.log("tl is", targetList);
      if (!targetList) {
        throw new Error(`List with ID ${listId} not found`);
      }
      const targetTask = targetList.tasks.find((task) => task.id === taskId);
      console.log("tl is", updatedTaskData);
      if (!targetTask) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      Object.assign(targetTask, updatedTaskData);
      await axios.put(`${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`, board);
      return { boardId, listId, taskId, updatedTaskData };
    } catch (error) {
      console.error("Error editing task:", error.message);
      throw error;
    }
  }
);

// Async thunk to remove a list from a board
export const removeListFromBoard = createAsyncThunk(
  "board/removeListFromBoard",
  async ({ boardId, listId }) => {
    try {
      const getResponse = await axios.get(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`
      );
      const board = getResponse.data;
      board.lists = board.lists.filter((list) => list.id !== listId);
      const putResponse = await axios.put(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`,
        board
      );
      console.log(putResponse);
      return { boardId, listId };
    } catch (error) {
      console.error("Error removing list from board:", error.message);
      throw error;
    }
  }
);

// Async thunk to delete a task from a specific list within a board
export const deleteTaskFromList = createAsyncThunk(
  "board/deleteTaskFromList",
  async ({ boardId, listId, taskId }) => {
    try {
      const getResponse = await axios.get(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`
      );
      const board = getResponse.data;
      const targetList = board.lists.find((list) => list.id === listId);
      if (!targetList) {
        throw new Error(`List with ID ${listId} not found`);
      }
      targetList.tasks = targetList.tasks.filter((task) => task.id !== taskId);
      const putResponse = await axios.put(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`,
        board
      );
      console.log(putResponse);
      return { boardId, listId, taskId };
    } catch (error) {
      console.error("Error deleting task:", error.message);
      throw error;
    }
  }
);

// Add the new board
export const addBoard = createAsyncThunk("board/addBoard", async (newBoard) => {
  const response = await axios.post(
    `${BASE_URL_FOR_JSON_DATA}/boards`,
    newBoard
  );
  return response.data;
});

// Async thunk to update a board on the backend
export const updateBoard = createAsyncThunk(
  "board/updateBoard",
  async ({ id, title }) => {
    const response = await axios.patch(
      `${BASE_URL_FOR_JSON_DATA}/boards/${id}`,
      { title }
    );
    return response.data;
  }
);

export const updateListTitle = createAsyncThunk(
  "board/updateListTitle",
  async ({ boardId, listId, newTitle }) => {
    try {
      // Step 1: Get the board data
      const getResponse = await axios.get(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`
      );
      const board = getResponse.data;

      if (!board || !board.lists) {
        throw new Error(`Board data is missing or invalid`);
      }

      // Step 2: Update the list title
      const targetList = board.lists.find((list) => list.id === listId);
      if (!targetList) {
        throw new Error(`List with ID ${listId} not found`);
      }
      targetList.title = newTitle;

      // Step 3: Send the updated board data back to the server
      const putResponse = await axios.put(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`,
        board
      );
      console.log(putResponse);

      // Return the updated title along with boardId and listId
      return { boardId, listId, newTitle };
    } catch (error) {
      console.error("Error updating list title:", error.message);
      throw error;
    }
  }
);

// Asynchronous action to delete a board by ID
export const deleteBoard = createAsyncThunk(
  "board/deleteBoard",
  async (boardId) => {
    const response = await axios.delete(
      `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`
    );
    console.log("response", response);
    return boardId;
  }
);

// Asynchronous thunk to add a new list to a specific board
export const addListToBoard = createAsyncThunk(
  "board/addListToBoard",
  async ({ boardId, newList }) => {
    try {
      const getResponse = await axios.get(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`
      );
      const board = getResponse.data;
      board.lists.push(newList);
      const putResponse = await axios.put(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`,
        board
      );
      console.log(putResponse);
      return { boardId, list: newList };
    } catch (error) {
      console.error("Error adding list:", error.message);
      throw error;
    }
  }
);

export const addTaskToList = createAsyncThunk(
  "board/addTaskToList",
  async ({ boardId, listId, newTask }) => {
    try {
      const getResponse = await axios.get(
        `${BASE_URL_FOR_JSON_DATA}/boards/${boardId}`
      );
      const board = getResponse.data;
      const targetList = board.lists.find((list) => list.id === listId);
      if (!targetList) {
        throw new Error(`List with ID ${listId} not found`);
      }
      targetList.tasks.push(newTask);
      const putResponse = await axios.put(
        `http://localhost:3001/boards/${boardId}`,
        board
      );
      console.log(putResponse);
      return { boardId, listId, task: newTask };
    } catch (error) {
      console.error("Error adding task to list:", error.message);
      throw error;
    }
  }
);

const initialState = {
  boards: [],
  status: "idle",
  error: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
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
      .addCase(updateBoard.fulfilled, (state, action) => {
        const index = state.boards.findIndex(
          (board) => board.id === action.payload.id
        );
        if (index !== -1) {
          state.boards[index].title = action.payload.title; // Update the board title in Redux
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addLabelToTask.fulfilled, (state, action) => {
        const { boardId, listId, taskId, label } = action.payload;
        const board = state.boards.find((board) => board.id === boardId);
        if (board) {
          const list = board.lists.find((list) => list.id === listId);
          if (list) {
            const task = list.tasks.find((task) => task.id === taskId);
            if (task) {
              task.labels.push(label);
            }
          }
        }
      })

      .addCase(deleteLabelFromTask.fulfilled, (state, action) => {
        const { boardId, listId, taskId, labelIndex } = action.payload;
        const board = state.boards.find((board) => board.id === boardId);
        if (board) {
          const list = board.lists.find((list) => list.id === listId);
          if (list) {
            const task = list.tasks.find((task) => task.id === taskId);
            if (task) {
              task.labels.splice(labelIndex, 1);
            }
          }
        }
      })

      .addCase(updateListTitle.fulfilled, (state, action) => {
        const { boardId, listId, newTitle } = action.payload;
        return {
          ...state,
          boards: state.boards.map((board) => {
            if (board.id === boardId && board.lists) {
              return {
                ...board,
                lists: board.lists.map((list) => {
                  if (list.id === listId) {
                    return {
                      ...list,
                      title: newTitle,
                    };
                  }
                  return list;
                }),
              };
            }
            return board;
          }),
        };
      })

      .addCase(addBoard.fulfilled, (state, action) => {
        const newBoard = action.payload;
        state.boards.push(newBoard);
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        const boardId = action.payload;
        state.boards = state.boards.filter((board) => board.id !== boardId);
      })
      .addCase(addListToBoard.fulfilled, (state, action) => {
        const { boardId, list } = action.payload;
        const board = state.boards.find((b) => b.id === boardId);

        if (board) {
          board.lists.push(list);
        }
      })

      .addCase(editTaskInList.fulfilled, (state, action) => {
        const { boardId, listId, taskId, updatedTaskData } = action.payload;
        const board = state.boards.find((b) => b.id === boardId);
        if (board) {
          const targetList = board.lists.find((l) => l.id === listId);
          if (targetList) {
            const targetTask = targetList.tasks.find(
              (task) => task.id === taskId
            );
            if (targetTask) {
              Object.assign(targetTask, updatedTaskData);
            }
          }
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteTaskFromList.fulfilled, (state, action) => {
        const { boardId, listId, taskId } = action.payload;

        const board = state.boards.find((b) => b.id === boardId);
        if (board) {
          const targetList = board.lists.find((l) => l.id === listId);
          if (targetList) {
            targetList.tasks = targetList.tasks.filter(
              (task) => task.id !== taskId
            );
          }
        }

        state.isLoading = false;
        state.error = null;
      })

      .addCase(removeListFromBoard.fulfilled, (state, action) => {
        const { boardId, listId } = action.payload;

        const board = state.boards.find((b) => b.id === boardId);
        if (board) {
          board.lists = board.lists.filter((list) => list.id !== listId);
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addTaskToList.fulfilled, (state, action) => {
        const { boardId, listId, task } = action.payload;
        const board = state.boards.find((b) => b.id === boardId);
        if (board) {
          const targetList = board.lists.find((l) => l.id === listId);
          if (targetList) {
            targetList.tasks.push(task);
          }
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.boards = action.payload;
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

export const selectLists = (state) => state.board.lists;

export const selectAllTasks = createSelector([selectLists], (lists) =>
  lists.flatMap((list) => list.tasks)
);

export const {
  addList,
  removeTask,
  addTask,
  removeList,
  editTask,
  updateBoardTitle,
  updateTaskOrder,
} = boardSlice.actions;

export default boardSlice.reducer;
