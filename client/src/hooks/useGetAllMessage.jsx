import axios from "axios";
import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux"
import { setPosts } from "../redux/postSlice";
import { setMessages } from "../redux/chatSlice";

export const useGetAllMessage = (id) => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.auth)
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,
                    { withCredentials: true }
                );

                // Check if the response indicates success
                if (res.data.success) {
                    console.log("Message fetched successfully:", res.data.messages);
                    dispatch(setMessages(res.data.messages));
                    // Handle posts here (e.g., store in state or context)
                } 
            } catch (error) {
                // Log the error with a more descriptive message
                console.error("Error fetching posts:", error.message || error);
            }
        };

        fetchAllMessage();
    }, [selectedUser]); // Empty dependency array ensures this runs only once on mount
};
