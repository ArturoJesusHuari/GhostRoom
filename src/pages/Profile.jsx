import { useState, useEffect } from "react";
import { useUser } from "../../context/userContext";
import { updateUser } from "../../utils/user";
import { toast } from "react-hot-toast";
import { Info, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    console.log(user)
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
      console.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      localStorage.removeItem("userId");
      setUser(null);
      toast.success("Usuario eliminado.");
      navigate("/")
    } catch (error) {
      toast.error("Error eliminando usuario.");
      console.error(error.message);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl mb-4">Profile</h1>

      {/* Info Banner */}
      <div className="flex items-center gap-3 border border-green-600 rounded-lg p-4 mb-8">
        <Info className="text-green-300 " size={20} />
        <p className="text-sm text-green-200">
          No sign-in needed; your user was auto-generated when you first
          visited.
        </p>
      </div>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-black border border-green-400 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-green-300">
              Change Username
            </h2>
            <p className="text-sm text-green-200">
              Current:{" "}
              <span className="font-medium text-green-100">
                {user.username}
              </span>
            </p>
            <form onSubmit={handleUsernameChange} className="space-y-3">
              <label className="block text-sm text-green-300">
                New Username:
              </label>
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
          </section>

          <section className="bg-black border border-red-500 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-red-400">
              Delete Account
            </h2>
            <p className="text-sm text-red-300">
              Permanently remove your account and all associated data. This
              cannot be undone.
            </p>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full bg-red-500 text-black py-2 rounded hover:bg-red-400 transition"
            >
              Delete User
            </button>
          </section>
        </div>
      ) : (
        <p className="text-center animate-pulse">Loading...</p>
      )}

      {/* Modal de confirmación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="p-6 rounded shadow-lg max-w-md w-full border border-green-500 bg-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg text-green-400">Confirmar eliminación</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-red-500 hover:text-red-400"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-green-400 mb-4">
              ¿Estás seguro de que querés eliminar tu usuario? Esta acción no se
              puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-green-500 text-green-400 hover:bg-green-700 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-black rounded hover:bg-red-400"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
