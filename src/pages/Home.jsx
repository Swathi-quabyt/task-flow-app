import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBoard,
  addBoard,
  deleteBoard,
  updateBoard,
} from "../slices/boardSlice";
import { FaTrash, FaEdit } from "react-icons/fa";
import { nanoid } from "@reduxjs/toolkit";
import { CalendarToday, AddCircleOutline } from "@mui/icons-material";
import { Tooltip, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";

const Home = () => {
  const dispatch = useDispatch();

  const boards = useSelector((state) => {
    return state.board.boards;
  });

  useEffect(() => {
    dispatch(fetchBoard());
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");

  const [editBoardopen, seteditBoardopen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const handleOpenForEdit = () => {
    seteditBoardopen(true);
  };

  const handleCloseForEdit = () => {
    seteditBoardopen(false);
  };

  const handleEditBoard = (boardId) => {
    console.log(editedTitle);
    if (editedTitle) {
      dispatch(updateBoard({ id: boardId, title: editedTitle }));
      seteditBoardopen(false);
      setEditedTitle("");
      console.log(boardId, editedTitle);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog box
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const newBoard = {
      id: nanoid(),
      title: boardTitle,
      lists: [],
    };
    console.log("new", newBoard);
    dispatch(addBoard(newBoard));
    setOpen(false);
    setBoardTitle("");
  };

  const handleDeleteBoard = (boardId) => {
    dispatch(deleteBoard(boardId));
  };

  return (
    <>
      {/* header part of task-nest */}
      <header>
        <div className="flex justify-between p-4 items-center">
          <div className="flex items-center">
            <CalendarToday className="text-blue-500 mt-1" />
            <h1 className="font-semibold text-xl pl-1 mt-0.5">Task Nest</h1>
          </div>

          <Tooltip title="Add Board" arrow>
            <Button
              onClick={handleOpen}
              variant="text"
              color="primary"
              startIcon={<AddCircleOutline />}
              className="MuiButton-root MuiButton-textPrimary  "
              // title="New Board"
            >
              New Board
            </Button>
          </Tooltip>
        </div>
      </header>

      {/* Dialog box for adding a new board */}
      <Dialog open={open} onClose={handleClose}>
        <div className="p-4">
          <h2 className="text-xl mb-4">Enter a title for the new board:</h2>
          <input
            type="text"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)} // Update the board title state as the input changes
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="secondary"
              variant="contained"
              sx={{ marginLeft: 2 }}
            >
              Add Board
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Dialog box for adding a new board */}
      <Dialog open={editBoardopen} onClose={handleCloseForEdit}>
        <div className="p-4">
          <h2 className="text-xl mb-4">Enter a title for the board:</h2>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleCloseForEdit}
              color="secondary"
              variant="outlined"
            >
              Cancel
            </Button>

            {boards.map((board, index) => (
              <div key={board.id}>
                {index === 0 && (
                  <Button
                    onClick={() => handleEditBoard(board.id)}
                    color="secondary"
                    variant="contained"
                    sx={{ marginLeft: 2 }}
                  >
                    Edit Board
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Dialog>

      <div className="flex flex-col justify-center items-center">
        <h1 className="font-sans font-extrabold text-3xl p-10  text-black  shadow-lg rounded-full border-2 border-dotted border-black">
          TaskNest: Organize with Ease
        </h1>
        <img
          src="https://www.cflowapps.com/wp-content/uploads/2018/07/task-management-process.png"
          alt=""
          className=" mb-2  "
        />
        <div className="h-12 w-5/12 mb-9 pl-4">
          <p className="font-medium">
            TaskNest is a modern task management platform that enables you to
            create, organize, and prioritize tasks with ease. Built with React,
            Material-UI, and Tailwind CSS, it offers an intuitive interface for
            managing multiple boards, lists, and tasks, with real-time updates
            via a JSON server.
          </p>
        </div>

        <div>
          <h1 className="text-xl border-2 font-medium border-blue-500 rounded-full pt-2 pb-3 pl-14 pr-14 mb-3  ">
            My Recent Task Boards
          </h1>
        </div>

        {/* Displaying the all the boards  */}

        <div className="flex flex-col space-y-2 font-medium">
          {boards.map((board) => (
            <div
              key={board.id}
              className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
            >
              <Link
                to={`/board/${board.id}`}
                className="flex-grow   px-4 py-2 rounded-md"
              >
                {board.title}
              </Link>
              <div className="flex space-x-2">
                <FaEdit
                  className="text-yellow-500 cursor-pointer"
                  onClick={handleOpenForEdit}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeleteBoard(board.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Home;
