import axios from "axios";
import { useEffect } from "react";
import {useDispatch} from "react-redux"
import { setPosts } from "../redux/postSlice";

export const useGetAllPosts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8000/api/v1/post/getallpost",
                    { withCredentials: true }
                );

                // Check if the response indicates success
                if (res.data.success) {
                    console.log("Posts fetched successfully:", res.data.posts);
                    dispatch(setPosts(res.data.posts));
                    // Handle posts here (e.g., store in state or context)
                } 
            } catch (error) {
                // Log the error with a more descriptive message
                console.error("Error fetching posts:", error.message || error);
            }
        };

        fetchAllPost();
    }, []); // Empty dependency array ensures this runs only once on mount
};
