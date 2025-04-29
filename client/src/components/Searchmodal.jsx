import axios from "axios";
import React, { useState } from "react";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import { FiSearch, FiX } from "react-icons/fi"; // Import FiX from react-icons
import { Link } from "react-router-dom";

const SearchModal = ({ setOpenSearch }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // API call to search users
  const searchUsers = async (searchTerm) => {
    if (!searchTerm) {
      setSearchResults([]); // Clear results if query is empty
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/search?search=${searchTerm}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Ensure credentials (cookies) are included in the request
        }
      );
      setSearchResults(res.data.users || []); // Set the search results
    } catch (error) {
      console.error("Error searching users:", error.message || error);
      toast.error("Error searching users.");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    searchUsers(value); // Trigger search when input changes
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start z-50 transition-all ease-in-out duration-300">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg relative shadow-xl transition-transform transform ease-in-out duration-300">
        {/* Close Button using FiX icon */}
        <button
          className="absolute top-2 right-2 text-xl p-2 rounded-full hover:bg-gray-200 focus:outline-none"
          onClick={() => setOpenSearch(false)}
        >
          <FiX className="text-gray-700" /> {/* Display FiX icon */}
        </button>

        {/* Search Input */}
        <div className="flex items-center mb-4 p-2 border border-gray-300 rounded-md focus-within:border-blue-500 transition-all ease-in-out duration-300">
          <FiSearch className="text-gray-500 mx-2" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search users..."
            className="flex-1 bg-transparent outline-none text-lg text-gray-700 placeholder-gray-500 focus:ring-0"
          />
        </div>

        {/* Show Search Results */}
        <div className="mb-6">
          {searchResults.length > 0 ? (
            <ul className="list-none p-0 m-0 border-t border-gray-300 max-h-52 overflow-y-auto">
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out"
                >
                  <Link
                    to={`/profile/${user._id}`}
                    className="flex items-center w-full"
                    onClick={() => setOpenSearch(false)}
                  >
                    <Avatar src={user.profilePicture} size="50" round={true} />
                    <div className="ml-3">
                      <h1 className="font-semibold text-gray-800 hover:text-blue-500 transition-colors duration-200 ease-in-out">
                        {user.name}
                      </h1>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            search && <p className="text-sm text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
