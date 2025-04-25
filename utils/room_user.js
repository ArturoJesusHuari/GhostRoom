import { supabase } from "./supabase";

export const isUserInRoom = async (roomId, userId) => {
    const { data, error } = await supabase
        .from("room_user")
        .select("*")
        .eq("id_user", userId)
        .eq("id_room", roomId)
    if (error) throw new Error(error.message);
    return data.length > 0
};

export const addUserInRoom = async (roomId, userId) => {
    const { error } = await supabase
        .from("room_user")
        .insert([{ id_user: userId, id_room: roomId }]);
    if (error) throw new Error(error.message);
};