import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message || "An error occurred during login."
        );
      } else if (error.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

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
          onSubmit={loginHandler}
          className="flex flex-col items-center w-full md:w-[60%] max-w-[400px] space-y-6 p-6 rounded-2xl"
        >
          <h2 className="text-[47px] font-semibold text-center md:text-left text-white">
            Happening now
          </h2>
          <h3 className="text-xl font-light text-center md:text-left text-gray-300">
            Join today.
          </h3>

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
            className="w-full py-3 bg-blue-500 hover:bg-blue-400 focus:ring-blue-500 focus:ring-1 text-white font-semibold rounded-full transition duration-200 ease-in-out"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5 inline-block"></span>
            ) : (
              "Sign in"
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-400">Don't have an account?</p>
            <Link
              to="/signup"
              className="text-blue-500 font-semibold hover:underline mt-1"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
