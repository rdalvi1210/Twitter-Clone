import axios from "axios";
import { useEffect } from "react";
import {useDispatch} from "react-redux"
import { setuserProfile } from "../redux/authSlice";

export const useGetuserProfile = (userId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchuserProfile = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/v1/user/${userId}/profile`,
                    { withCredentials: true }
                );

                // Check if the response indicates success
                if (res.data.success) {
                    console.log("Users fetched successfully:", res.data.users);
                    dispatch(setuserProfile(res.data.user));
                    // Handle posts here (e.g., store in state or context)
                } 
            } catch (error) {
                // Log the error with a more descriptive message
                console.error("Error fetching posts:", error.message || error);
            }
        };

        fetchuserProfile();
    }, [userId]); // Empty dependency array ensures this runs only once on mount
};
