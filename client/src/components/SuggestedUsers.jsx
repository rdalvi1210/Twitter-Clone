import { useContext } from "react";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import myContext from "./Context/data/myContext";
import axios from "axios";
import toast from "react-hot-toast";
import { setsuggestedUsers } from "../redux/authSlice";

const SuggestedUsers = () => {
  const { mode } = useContext(myContext); // Get mode from context
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const followUnfollow = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/followOrUnfollow/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedSuggestedUsers = suggestedUsers.map((u) => {
          if (u._id === id) {
            const isFollowing = u.followers.includes(user?._id);
            return {
              ...u,
              followers: isFollowing
                ? u.followers.filter((followerId) => followerId !== user?._id)
                : [...u.followers, user?._id],
            };
          }
          return u;
        });

        dispatch(setsuggestedUsers(updatedSuggestedUsers));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating follow status.");
    }
  };

  return (
    <div
      className={`shadow-lg rounded-lg p-4 mb-6 ${
        mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Suggestions for you</h2>
      {suggestedUsers?.length === 0 ? (
        <p className="text-center text-gray-500">
          No suggestions available at the moment.
        </p>
      ) : (
        <div className="space-y-4">
          {suggestedUsers?.map((suggestedUser) => (
            <div
              key={suggestedUser?._id}
              className={`flex justify-between items-center p-2 rounded-md transition-colors ${
                mode === "dark"
                  ? "hover:bg-gray-700 border-gray-700"
                  : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              {/* Avatar and username */}
              <Link
                to={`/profile/${suggestedUser?._id}`}
                className="flex items-center"
              >
                <Avatar
                  src={suggestedUser?.profilePicture}
                  size="50"
                  round={true}
                />
                <div
                  className={`ml-3 text-lg font-semibold ${
                    mode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {suggestedUser?.username}
                </div>
              </Link>

              {/* Follow/Unfollow button */}
              <button
                onClick={() => followUnfollow(suggestedUser?._id)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-300 ${
                  mode === "dark"
                    ? "bg-white text-black hover:bg-gray-600"
                    : "bg-black text-white hover:bg-gray-400"
                }`}
              >
                {suggestedUser.followers.includes(user?._id)
                  ? "Unfollow"
                  : "Follow"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedUsers;
