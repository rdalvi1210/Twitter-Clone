import React, { useContext } from "react";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import myContext from "./Context/data/myContext";

const NotificationPage = () => {
  const { likeNotification } = useSelector(
    (state) => state.realTimeNotification
  );
  const { mode } = useContext(myContext);

  return (
    <div
      className={`h-screen w-full fixed z-10 left-0 shadow-lg p-6 overflow-y-auto
        md:left-[20%] md:w-[80%] lg:w-[70%] xl:w-[50%]
        ${
          mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
        }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            mode === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Notifications
        </h1>
      </div>

      <div className="space-y-4">
        {likeNotification.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 rounded-lg shadow-md flex items-center gap-4 hover:bg-gray-100 transition
              ${
                mode === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white"
              }`}
          >
            <Avatar
              src={notification?.userDetails?.profilePicture}
              name={notification?.userDetails?.username}
              size="40"
              round
            />
            <div className="flex-grow">
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-300" : "text-gray-800"
                }`}
              >
                <strong>{notification?.userDetails?.username}</strong>{" "}
                {notification?.message}
              </p>
            </div>
            <span
              className={`text-xs ${
                mode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {notification?.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
