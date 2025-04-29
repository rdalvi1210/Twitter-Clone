import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/authSlice";
import myContext from "./Context/data/myContext";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useContext(myContext);

  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture || "",
    profilePreview: user?.profilePicture || "",
    bio: user?.bio || "",
    gender: user?.gender || "male",
    name: user?.name || "",
  });

  const [loading, setLoading] = useState(false);

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({
        ...input,
        profilePhoto: file,
        profilePreview: URL.createObjectURL(file),
      });
    }
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editHandler = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("name", input.name);
    formData.append("gender", input.gender);
    if (input.profilePhoto instanceof File) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/profile/edit",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
          name: res.data.user?.name,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating profile.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        mode === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
      } flex flex-col items-center`}
    >
      <main
        className={`w-full max-w-3xl ${
          mode === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md mt-6 p-6`}
      >
        <h1
          className={`font-bold text-2xl text-center mb-6 ${
            mode === "dark" ? "text-white" : "text-black"
          }`}
        >
          Edit Profile
        </h1>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="h-24 w-24 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={input.profilePreview || "default-profile-picture-url"}
              alt="profile"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <input
            type="file"
            name="profilePhoto"
            onChange={fileChangeHandler}
            className="hidden"
            id="imageInput"
          />
          <button
            onClick={() => document.getElementById("imageInput").click()}
            className="bg-blue-500 h-8 px-4 rounded-md text-white font-semibold hover:bg-blue-600"
          >
            Change Photo
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="name" className="font-semibold text-lg mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter your name here..."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="bio" className="font-semibold text-lg mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
            rows="4"
            placeholder="Enter your bio here..."
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="gender" className="font-semibold text-lg mb-2">
            Gender
          </label>
          <select
            id="gender"
            onChange={(e) => selectChangeHandler(e.target.value)}
            value={input.gender}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={editHandler}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md text-white font-semibold shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5 inline-block"></span>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-400 hover:bg-gray-500 px-6 py-2 rounded-md text-white font-semibold shadow-lg"
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
