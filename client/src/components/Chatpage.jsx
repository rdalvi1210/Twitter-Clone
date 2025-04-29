import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setselectedUser } from "../redux/authSlice";
import { setMessages } from "../redux/chatSlice";
import myContext from "./Context/data/myContext";
import Messages from "./Messages";

const Chatpage = () => {
  const { mode } = useContext(myContext); // Get mode from context
  const { suggestedUsers, selectedUser, user } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers } = useSelector((store) => store.chat);
  const { messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const [textMessage, setTextMessage] = useState("");

  // Create a ref for scrolling
  const messageEndRef = useRef(null);

  const sendMessage = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Scroll to the latest message after it updates
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // This runs whenever messages change

  useEffect(() => {
    return () => {
      dispatch(setselectedUser(null));
    };
  }, []);

  return (
    <div
      className={`flex ml-[20%] h-screen ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Sidebar Section */}
      <section
        className={`w-full md:w-1/3 my-8 border-r ${
          mode === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        {/* Header */}
        <div
          className={`flex gap-3 items-center px-4 py-3 border-b ${
            mode === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-300 bg-white"
          }`}
        >
          <Avatar src={user?.profilePicture} size="40" round={true} />
          <div className="flex flex-col">
            <span
              className={`${
                mode === "dark" ? "text-white" : "text-gray-800"
              } text-lg font-semibold`}
            >
              {user?.username}
            </span>
          </div>
        </div>
        <hr
          className={`mb-4 ${
            mode === "dark" ? "border-gray-700" : "border-gray-300"
          }`}
        />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => {
              const isOnline = onlineUsers?.includes(user?._id);
              return (
                <div
                  onClick={() => dispatch(setselectedUser(user))}
                  key={user?._id}
                  className={`flex gap-3 items-center p-3 cursor-pointer hover:bg-opacity-80 transition-all ease-in-out ${
                    mode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <Avatar src={user?.profilePicture} size="50" round={true} />
                  <div className="flex flex-col">
                    <span
                      className={`${
                        mode === "dark" ? "text-white" : "text-gray-800"
                      } font-medium`}
                    >
                      {user?.username}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isOnline ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isOnline ? "online" : "offline"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p
              className={`${
                mode === "dark" ? "text-gray-400" : "text-gray-500"
              } px-3`}
            >
              No suggested users available
            </p>
          )}
        </div>
      </section>

      {/* Conditional Rendering */}
      {selectedUser ? (
        // Chat Section
        <section
          className={`flex-1 border-l flex flex-col h-full ${
            mode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          {/* Header */}
          <div
            className={`flex gap-3 items-center px-4 py-3 border-b ${
              mode === "dark"
                ? "border-gray-700 bg-gray-800"
                : "border-gray-300 bg-white"
            }`}
          >
            <Avatar src={selectedUser?.profilePicture} size="40" round={true} />
            <div className="flex flex-col">
              <span
                className={`${
                  mode === "dark" ? "text-white" : "text-gray-800"
                } text-lg font-semibold`}
              >
                {selectedUser?.username}
              </span>
              <span
                className={`${
                  mode === "dark" ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                online
              </span>
            </div>
          </div>

          {/* Messages */}
          <Messages selectedUser={selectedUser} />

          {/* Input Section */}
          <div
            className={`flex items-center p-4 border-t ${
              mode === "dark"
                ? "bg-gray-900 border-gray-700"
                : "bg-gray-50 border-gray-300"
            }`}
          >
            <input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className={`flex-1 p-3 border rounded-full focus:outline-none ${
                mode === "dark"
                  ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                  : "bg-white text-gray-800 border-gray-300 placeholder-gray-500"
              }`}
              placeholder="Type a message..."
            />
            <button
              onClick={() => sendMessage(selectedUser?._id)}
              className={`px-4 py-2 ml-3 rounded-full font-semibold transition-all ease-in-out ${
                mode === "dark"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Send
            </button>
          </div>
        </section>
      ) : (
        // Placeholder Section
        <div className="flex flex-col items-center justify-center mx-auto">
          <FaHeart
            className={`w-24 h-24 my-4 ${
              mode === "dark" ? "text-blue-400" : "text-blue-500"
            }`}
          />
          <h1
            className={`${
              mode === "dark" ? "text-white" : "text-gray-700"
            } font-medium text-lg`}
          >
            Your messages
          </h1>
          <span
            className={`${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            Send a message to start a chat.
          </span>
        </div>
      )}
      {/* Scroll-to-bottom reference */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default Chatpage;
