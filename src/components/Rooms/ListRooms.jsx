import { useState } from "react";
import { useUser } from "../../../context/userContext";
import { Link } from "react-router-dom";
import { deleteRoom } from "../../../utils/room";
import { toast } from "react-hot-toast";
import { Trash2, X } from "lucide-react";

export default function ListRooms({ rooms, setRooms }) {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const confirmDeleteRoom = (roomId) => {
    setRoomToDelete(roomId);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    try {
      await deleteRoom(roomToDelete);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomToDelete));
      toast.success("Room deleted.");
    } catch (error) {
      toast.error("Failed to delete room.");
      console.error(error.message);
    } finally {
      setIsModalOpen(false);
      setRoomToDelete(null);
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto custom-scrollbar">
      <ul className="space-y-4">
        {Array.isArray(rooms) &&
          rooms
            .filter((room) => room && room.name)
            .map((room, index) => (
              <li
                key={index}
                className="flex flex-col p-4 border border-green-500 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <Link
                    to={`/room/${room.id}`}
                    className="text-lg font-bold text-green-400 hover:underline"
                  >
                    {room.name}
                  </Link>
                  {user?.id === room.id_owner && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        confirmDeleteRoom(room.id);
                      }}
                      className=" text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-green-400 mt-1">
                  Message Duration:{" "}
                  <span className="font-semibold">
                    {room.messages_duration_seconds} sec
                  </span>
                </p>
                {room.password && (
                  <p className="text-sm text-yellow-400">Password Protected</p>
                )}
              </li>
            ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="p-6 rounded shadow-lg max-w-md w-full border border-green-500 bg-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg text-green-400">Confirm Deletion</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-500 hover:text-red-400"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-green-400 mb-4">
              Are you sure you want to delete this room?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-green-500 text-green-400 hover:bg-green-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRoom}
                className="px-4 py-2 bg-red-500 text-black rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
