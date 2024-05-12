import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addListToBoard, fetchBoard } from "../slices/boardSlice";
import List from "./List";
import SearchTasks from "./SearchTasks";
import { nanoid } from "@reduxjs/toolkit";
import PropTypes from "prop-types";

const Board = ({ individualboard }) => {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.board.boards);
  console.log("board compo", board);

  const [newListTitle, setNewListTitle] = useState("");

  const handleAddList = () => {
    const newList = {
      id: nanoid(),
      title: newListTitle,
      tasks: [],
    };

    dispatch(addListToBoard({ boardId: individualboard.id, newList }));
    setNewListTitle("");
  };

  useEffect(() => {
    // Fetch the board data when component is mounted
    dispatch(fetchBoard());
  }, [dispatch]);
  console.log("Board fetched compo1", board);

  if (board.status === "loading") {
    return <div>Loading...</div>;
  }

  if (board.status === "failed") {
    return <div>Error: {board.error}</div>;
  }

  return (
    <div className="center  p-4  rounded-lg shadow-lg">
      <div className="p-5">
        <SearchTasks />
      </div>

      <div className="mb-4">
        <div className="title-display">
          <h2 className="text-2xl font-semibold mb-4 ml-5">Board title : {individualboard.title}</h2>
        </div>


        <input
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)} 
          placeholder="Enter new list title"
          className="p-2 border rounded-lg border-black ml-5"
        />
        <button
          onClick={handleAddList}
          className="ml-2 border-2 border-black p-2 rounded-lg hover:bg-slate-300"
        >
          Add List
        </button>
      </div>

      <div className="center p-4 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-2 py-2 w-full">
          {individualboard.lists.map((list) => (
            <List
              key={list.id}
              list={list}
              index={list.id}
              boardid={individualboard.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
Board.propTypes = {
  individualboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    lists: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        tasks: PropTypes.array.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
export default Board;
