import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import Rightsidebar from "./Rightsidebar";
import { useGetAllPosts } from "../hooks/useGetAllPosts";
import { useGetSuggestUsers } from "../hooks/useGetSuggestUsers";
import Create from "./Create";


const Home = () => {
  useGetAllPosts();
  useGetSuggestUsers();

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="inner flex-grow ml-0 lg:ml-10 border-r border-gray-300 m-2">
        <Create />
        <Feed />
        <Outlet />
      </div>
      <Rightsidebar />
    </div>

  );
};

export default Home;
