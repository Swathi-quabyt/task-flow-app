import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Home from "./pages/Home";
import BoardView from "./pages/BoardView";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoard } from "./slices/boardSlice";

const App = () => {
  const dispatch = useDispatch();

  const boards = useSelector((state) => {
    return state.board.boards;
  });

  console.log("Boards before dispatch:", boards);
  useEffect(() => {
    dispatch(fetchBoard());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/board/:boardIndex"
            element={<BoardView boards={boards} />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
