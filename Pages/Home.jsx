import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="font-serif font-extrabold text-3xl p-10 m-10 text-black  shadow-lg rounded-full border-2 border-black shadow-cyan-500">
          TaskNest: Organize with Ease
        </h1>
        <Link
          to="/board"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Go to Board
        </Link>
      </div>
    </>
  );
};

export default Home;
