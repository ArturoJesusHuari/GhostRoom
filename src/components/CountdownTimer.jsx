import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../context/userContext";
import { deleteUser } from "../../utils/user";
import { useNavigate } from "react-router-dom";
import { Timer } from "lucide-react";

const CountdownTimer = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);

  const handleUserDeletion = useCallback(async () => {
    await deleteUser(user.id);
    localStorage.removeItem("userId");
    navigate("/");
  }, [user.id, navigate]);

  useEffect(() => {
    if (!user?.removal_at) return;

    const interval = setInterval(() => {
      const now = new Date();
      const removalTime = new Date(user.removal_at);
      const remainingTime = removalTime - now;

      if (remainingTime <= 0) {
        clearInterval(interval);
        handleUserDeletion();
        return;
      }

      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [user?.removal_at, handleUserDeletion, loading]);

  return (
    <div className="flex flex-col items-center gap-3 p-2 bg-black text-green-400 font-mono">
      {loading ? (
        <p className="text-sm text-green-300 animate-pulse">...</p>
      ) : (
        <div className="flex flex-col justify-end max-w-40">
          <span className="text-md text-end font-bold text-green-300 truncate whitespace-nowrap">{user.username}</span>
          <div className="flex items-center space-x-2">
            <Timer size={22} className="text-green-400" />
            <p className="text-sm text-green-300">{timeLeft}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;