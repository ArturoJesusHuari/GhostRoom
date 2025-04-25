import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById } from "../utils/room";
import { isUserInRoom, addUserInRoom } from "../utils/room_user";
import { useUser } from "./userContext";
import { toast } from "react-hot-toast";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpenInvitation, setIsModalOpenInvitation] = useState(false);

    const fetchRoom = useCallback(async () => {
        setLoading(true);
        if (!user?.id) return;

        try {
            const data = await getRoomById(id);
            if (!data) {
                toast.error("Room not found.");
                navigate("/rooms");
                return;
            }

            if (data.id_owner !== user.id) {
                const isInRoom = await isUserInRoom(id, user.id);
                if (!isInRoom) {
                    setIsModalOpenInvitation(true);
                    return;
                }
            }

            setRoom(data);
        } catch (error) {
            toast.error("Room not found.");
            console.error(error.message);
            navigate("/rooms");
        } finally {
            setLoading(false);
        }
    }, [id, user, navigate]);

    const handleAcceptInvitation = async () => {
        try {
            await addUserInRoom(id, user.id);
            toast.success("Joined the room successfully!");
            setIsModalOpenInvitation(false);
            fetchRoom();
        } catch (error) {
            toast.error("Error joining the room.");
            console.error(error.message);
        }
    };

    const handleDeclineInvitation = () => {
        setIsModalOpenInvitation(false);
        navigate("/rooms");
    };

    useEffect(() => {
        fetchRoom();
    }, [fetchRoom]);

    return (
        <RoomContext.Provider
            value={{
                room,
                loading,
                isModalOpenInvitation,
                handleAcceptInvitation,
                handleDeclineInvitation,
                fetchRoom
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};

export const useRoom = () => useContext(RoomContext);
