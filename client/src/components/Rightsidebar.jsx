import axios from "axios";
import { useContext, useState } from "react";
import Avatar from "react-avatar";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import myContext from "./Context/data/myContext";
import SuggestedUsers from "./SuggestedUsers";

const Rightsidebar = () => {
  const context = useContext(myContext);
  const { mode } = context;
  const { likeNotification } = useSelector(
    (state) => state.realTimeNotification
  );
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchUsers = async (searchTerm) => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/search?search=${searchTerm}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSearchResults(res.data.users || []);
    } catch (error) {
      console.error("Error searching users:", error.message || error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    searchUsers(value);
  };

  return (
    <div
      className={`hidden lg:block w-[25%] p-4 ${
        mode === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Search Bar */}
      <div
        className={`flex items-center mb-6 rounded-full shadow-md p-2 transition-all ${
          mode === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <FiSearch className="text-gray-400 mx-2" size={18} />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className={`flex-1 bg-transparent px-2 py-1 rounded-full outline-none text-sm ${
            mode === "dark" ? "text-white" : "text-black"
          }`}
        />
      </div>

      {/* Search Results */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Search Results</h2>
        {searchResults.length > 0
          ? searchResults.map((user) => (
              <Link
                to={`/profile/${user?._id}`}
                key={user._id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  mode === "dark"
                    ? "hover:bg-gray-700 bg-gray-800"
                    : "hover:bg-gray-200 bg-gray-100"
                } mb-3`}
              >
                <Avatar src={user.profilePicture} size="40" round />
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </Link>
            ))
          : search && <p className="text-sm text-gray-500">No users found.</p>}
      </div>

      {/* Suggested Users */}
      <SuggestedUsers mode={mode} />

      {/* Recent Activity */}
      <div
        className={`shadow-md rounded-xl p-4 mt-6 ${
          mode === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {likeNotification.map((notify) => (
          <div key={notify?._id} className="flex items-center gap-3 mb-3">
            <Avatar
              src={notify?.userDetails?.profilePicture}
              size="35"
              round={true}
            />
            <p
              className={`text-sm ${
                mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <strong>{notify?.userDetails?.username}</strong> liked your post
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rightsidebar;
