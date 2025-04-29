import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setInput({ username: "", email: "", password: "" });
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message || "An error occurred during signup."
        );
      } else if (error.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="container flex flex-col md:flex-row items-center justify-between px-6 md:px-12 space-y-6 md:space-y-0">
        <div className="text-center md:text-left w-full md:w-1/2 flex justify-center items-center">
          <img
            src="https://www.freepnglogos.com/uploads/twitter-x-logo-png/twitter-x-logo-png-9.png"
            alt="Logo"
            className="h-[300px] md:h-[500px] object-contain"
          />
        </div>
        <form
          onSubmit={signupHandler}
          method="POST"
          className="flex flex-col items-center w-full md:w-[60%] max-w-[400px] space-y-6 p-6 rounded-2xl"
        >
          <h2 className="text-[47px] font-semibold text-center md:text-left text-white">
            Happening now
          </h2>
          <h3 className="text-xl font-light text-center md:text-left text-gray-300">
            Join today.
          </h3>
          <input
            type="text"
            className="w-full py-3 px-4 bg-white text-black rounded-full border border-gray-600 focus:outline-none placeholder-gray-400"
            placeholder="Username"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
          />
          <input
            type="email"
            className="w-full py-3 px-4 bg-white text-black rounded-full border border-gray-600 focus:outline-none placeholder-gray-400"
            placeholder="Enter your email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
          />
          <input
            type="password"
            className="w-full py-3 px-4 bg-white text-black rounded-full border border-gray-600 focus:outline-none placeholder-gray-400"
            placeholder="Enter your password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-400 focus:ring-blue-500 focus:ring-1 text-white font-semibold rounded-full transition duration-200 ease-in-out flex justify-center items-center"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              "Create account"
            )}
          </button>
          <div className="mt-6 text-center">
            <p className="text-gray-400">Already have an account?</p>
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:underline mt-1"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
