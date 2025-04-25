import { supabase } from "./supabase";
import { addUserInRoom } from "./room_user";

export const getRooms = async (userId) => {
  const { data, error } = await supabase
    .from("room_user")
    .select("rooms(*)") // Relación con la tabla 'rooms'
    .eq("id_user", userId);

  if (error) throw new Error(error.message);
  const rooms = data.map((entry) => entry.rooms);
  return rooms;
};

export const getRoomById = async (roomId) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const createRoom = async (room) => {
  const { error: insertError } = await supabase
    .from("rooms")
    .insert([room])
    .single();
  if (insertError) throw new Error(insertError.message);
  const { data: lastRoomData, error: getRoomError } = await addOwnerToUserRoom(
    room.id_owner
  );
  if (getRoomError) throw new Error(getRoomError.message);
  return lastRoomData;
};

export const deleteRoom = async (roomId) => {
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) throw new Error(error.message);
};

export const addOwnerToUserRoom = async (userId) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id_owner", userId)
    .order("create_at", { ascending: false })
    .limit(1)
    .single();
  if (error) throw new Error(error.message);
  console.log(data)
  await addUserInRoom(
    data.id,
    userId
   );
  return data;
};
