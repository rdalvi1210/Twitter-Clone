import axios from "axios";
import { useContext, useState } from "react";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import { CiHome, CiSearch } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { GoSun } from "react-icons/go";
import { IoIosNotificationsOutline, IoIosSend } from "react-icons/io";
import { MdOutlineExplore } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/authSlice";
import { setPosts, setselectedPost } from "../redux/postSlice";
import myContext from "./Context/data/myContext";
import CreatePost from "./CreatePost";
import SearchModal from "./Searchmodal";

const LeftSidebar = () => {
  const context = useContext(myContext);
  const { mode, toggleMode } = context;
  const dispatch = useDispatch();
  const [openPost, setOpenPost] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Toggle sidebar
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPosts([]));
        dispatch(setselectedPost(null));
        toast.success(res.data.message || "Logout successful!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const sidebarHandler = (textType) => {
    switch (textType) {
      case "Logout":
        logoutHandler();
        break;
      case "Post":
        setOpenPost(true);
        break;
      case user?.name || user?.username:
        navigate(`/profile/${user?._id}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Explore":
        navigate("/explore");
        break;
      case "Messages":
        navigate("/chat");
        break;
      case "Search":
        setOpenSearch(true);
        break;
      case "Mode":
        toggleMode();
        break;
      case "Notifications":
        navigate("/notification");
        break;
      default:
        break;
    }
  };

  const leftSidebarItems = [
    { icon: <CiHome size={28} />, text: "Home" },
    { icon: <CiSearch size={28} />, text: "Search" },
    { icon: <MdOutlineExplore size={28} />, text: "Explore" },
    { icon: <IoIosSend size={28} />, text: "Messages" },
    { icon: <IoIosNotificationsOutline size={28} />, text: "Notifications" },
    {
      icon: mode === "light" ? <FaMoon size={28} /> : <GoSun size={28} />,
      text: "Mode",
    },
    {
      icon: <Avatar src={user?.profilePicture} size="40" round={true} />,
      text: user?.name || user?.username,
    },
    { icon: <FiLogOut size={28} />, text: "Logout" },
    { text: "Post" },
  ];

  return (
    <>
      {openPost && <CreatePost setOpenPost={setOpenPost} />}
      {openSearch && <SearchModal setOpenSearch={setOpenSearch} />}
      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-screen shadow-lg flex flex-col py-4 px-6 transition-transform duration-300 z-30 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-[18%] xl:w-[18%] ${
          mode === "dark" ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-3xl font-bold text-blue-500">
            <span className="text-black">X</span> Corp
          </div>
          {/* Close Button */}
          <button
            className="md:hidden text-xl p-1 rounded-full bg-gray-200"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✖
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-6">
          {leftSidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className={`flex items-center gap-4 py-2 px-4 rounded-full cursor-pointer transition-colors ${
                item.text === "Post"
                  ? "bg-black text-white justify-center hover:bg-gray-500"
                  : `${
                      mode === "dark"
                        ? "hover:bg-gray-300 hover:text-black" // Light gray hover in dark mode
                        : "hover:bg-gray-100 hover:text-black" // Default light mode hover
                    }`
              } ${
                item.text === "Post" && mode === "dark" ? "bg-gray-500" : ""
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-lg font-medium">{item.text}</span>
              {item.text === "Notifications" && likeNotification.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {likeNotification.length}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Button for Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-2xl text-gray-900 bg-white rounded-full shadow-lg"
        >
          {isSidebarOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default LeftSidebar;
