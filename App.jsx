
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Home from './pages/Home';
import BoardView from './pages/BoardView';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board" element={<BoardView />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
