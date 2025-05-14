import { useState, useEffect } from "react";
import { createRoom, getRooms } from "../../utils/room";
import { useUser } from "../../context/userContext";
import { toast } from "react-hot-toast";
import ListRooms from "../components/Rooms/ListRooms";
import { Plus, X, Info } from "lucide-react";

export default function Rooms() {
  const { user } = useUser();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpenToCreateRoom, setIsModalOpenToCreateRoom] = useState(false);
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [newRoom, setNewRoom] = useState({
    name: "",
    messages_duration_seconds: 3600,
  });

  useEffect(() => {
    async function fetchRooms() {
      if (!user.id) return;
      try {
        const dataRooms = await getRooms(user.id);
        setRooms(dataRooms);
      } catch (error) {
        toast.error("Error loading rooms.");
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, [user, isModalOpenToCreateRoom]);

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    setDuration((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in.");
      return;
    }
    if (!newRoom.name.trim()) {
      toast.error("Room name is required.");
      return;
    }
    if (duration.hours == 0 && duration.minutes == 0 && duration.seconds == 0) {
      toast.error("The duration of the message must be longer");
      return;
    }

    try {
      const totalSeconds =
        duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
      const room = await createRoom({
        id_owner: user.id,
        ...newRoom,
        messages_duration_seconds: totalSeconds,
      });
      setRooms([...rooms, room]);
      toast.success("Room created.");
      setNewRoom({
        name: "",
        messages_duration_seconds: 0,
        redirection_address: "",
        password: "",
      });
      setDuration({ hours: 0, minutes: 0, seconds: 0 });
      setIsModalOpenToCreateRoom(false);
    } catch (error) {
      toast.error("Failed to create room.");
      console.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-2 sm:mx-auto mt-6">
      <h1 className="text-2xl mb-4">Rooms</h1>
      <button
        onClick={() => setIsModalOpenToCreateRoom(true)}
        className="flex items-center gap-2 bg-green-600 text-black py-2 px-4 rounded hover:bg-green-500 transition"
      >
        <Plus size={18} /> Create Room
      </button>

      {isModalOpenToCreateRoom && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="p-6 rounded shadow-lg max-w-md w-full border border-green-400">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg">Create Room</h2>
              <button
                onClick={() => setIsModalOpenToCreateRoom(false)}
                className="text-red-500 hover:text-red-400"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleCreateRoom}
              className="space-y-3 p-4 border border-green-400 rounded"
            >
              <label className="block text-sm">Room Name:</label>
              <input
                type="text"
                value={newRoom.name}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, name: e.target.value })
                }
                className="w-full bg-black border border-green-400 p-2 text-green-300 focus:outline-none"
              />

              <label className="block text-sm mb-1">Message Duration:</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col">
                  <span className="text-xs text-green-400">Hours</span>
                  <input
                    type="number"
                    name="hours"
                    min="0"
                    value={duration.hours}
                    onChange={handleDurationChange}
                    className="no-spinner bg-black border border-green-400 p-2 text-green-300 focus:outline-none rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-green-400">Minutes</span>
                  <input
                    type="number"
                    name="minutes"
                    min="0"
                    value={duration.minutes}
                    onChange={handleDurationChange}
                    className="no-spinner bg-black border border-green-400 p-2 text-green-300 focus:outline-none rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-green-400">Seconds</span>
                  <input
                    type="number"
                    name="seconds"
                    min="0"
                    value={duration.seconds}
                    onChange={handleDurationChange}
                    className="no-spinner bg-black border border-green-400 p-2 text-green-300 focus:outline-none rounded"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 border border-green-600 rounded-lg p-4">
                <Info className="text-green-300 " size={40} />
                <p className="text-xs text-green-200">
                  The countdown starts when the message is sent — not when it's
                  read. Messages will be deleted even if unseen.
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-black py-2 rounded hover:bg-green-500 transition"
              >
                <Plus size={18} /> Create Room
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-center animate-pulse">Loading rooms...</p>
        ) : rooms.length === 0 && rooms.length === 0 ? (
          <p className="text-center">No rooms available.</p>
        ) : (
          <ListRooms rooms={rooms} setRooms={setRooms} />
        )}
      </div>
    </div>
  );
}
