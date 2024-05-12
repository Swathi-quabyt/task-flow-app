import Board from "../components/Board";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const BoardView = ({ boards }) => {
  console.log("All boards in BoardView:", boards);

  // Get the board index
  const { boardIndex } = useParams();
  const boardId = boardIndex;

  const getBoardById = (boards, index) => {
    return boards.find((board) => board.id === index);
  };

  const individualboard = getBoardById(boards, boardId);
  console.log("board in bv", individualboard);

  if (!individualboard) {
    return <div>Board not found</div>;
  }

  return (
    <div className="p-4">
      {/* Calling board component for each board in boards  */}
      <Board individualboard={individualboard} />
    </div>
  );
};

BoardView.propTypes = {
  boards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      lists: PropTypes.array.isRequired,
    })
  ).isRequired,
};

export default BoardView;
