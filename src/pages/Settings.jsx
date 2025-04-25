import { useState, useEffect } from "react";
import { useUser } from "../../context/userContext";
import { updateUser } from "../../utils/user";
import { toast } from "react-hot-toast";

export default function Settings() {
  const { user, setUser } = useUser();
  const [newUsername, setNewUsername] = useState(user?.username || "");

  useEffect(() => {
    setNewUsername(user?.username || "");
  }, [user]);

  const handleUsernameChange = async (e) => {
    e.preventDefault();

    if (!newUsername.trim()) {
      toast.error("Username cannot be empty.");
      return;
    }

    try {
      await updateUser(user.id, newUsername);
      setUser((prevUser) => ({
        ...prevUser,
        username: newUsername,
      }));
      toast.success("Username updated successfully.");
    } catch (error) {
      toast.error("Error updating username.");
      console.error(error.message)
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl mb-4">User Settings</h1>

      {user ? (
        <div className="p-4 bg-black border border-green-400 rounded-lg">
          <form onSubmit={handleUsernameChange} className="space-y-3">
            <label className="block text-sm text-green-300">New Username:</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-black border border-green-400 p-2 text-green-300 focus:outline-none focus:border-green-300"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-black py-2 rounded hover:bg-green-500 transition"
            >
              Update Username
            </button>
          </form>
        </div>
      ) : (
        <p className="text-center animate-pulse">Loading...</p>
      )}
    </div>
  );
}
