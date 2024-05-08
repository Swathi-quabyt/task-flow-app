import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addList,fetchBoard } from '../slices/boardSlice';
import List from './List';
import SearchTasks from './SearchTasks';

const Board = () => {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.board);
const[newListTitle,setNewListTitle]=useState('')

// Function to handle adding a new list
const handleAddList = () => {
  if (newListTitle.trim() !== '') {
    dispatch(addList({ title: newListTitle })); // Dispatch addList with the new title
    setNewListTitle(''); // Reset input field
  }
};


  useEffect(() => {
    // Fetch the board data when component is mounted
    dispatch(fetchBoard());
  }, [dispatch]);
  console.log('Board fetched:', board);

  if (board.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (board.status === 'failed') {
    return <div>Error: {board.error}</div>;
  }
  

  return (
    <div className="center  p-4 rounded-lg shadow-lg">
      
      {/* Include SearchTasks at the top of the board */}
      <div className='p-5'>
      <SearchTasks />
      </div>

{/* Input and button for adding a new list */}
<div className="mb-4">
        <input
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)} // Collects new list title
          placeholder="Enter new list title"
          className="p-2 border rounded"
        />
        <button onClick={handleAddList} className="ml-2 bg-blue-500 text-white p-2 rounded">
          Add List
        </button>
      </div>


      <h2 className="text-2xl font-bold mb-4 ">{board.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-2 py-2 w-full">
        {board.lists.map((list) => (
          <List key={list.id} list={list} index={list.id} />
        ))}
        
      </div>
      
    </div>
  );
};

export default Board;
