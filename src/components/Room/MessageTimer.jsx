import { useEffect, useState, useRef } from "react";

export default function MessageTimer({ createdAt, duration, onExpire }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [color, setColor] = useState("text-slate-700");
  const intervalRef = useRef(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const expiration = new Date(createdAt);
      expiration.setSeconds(expiration.getSeconds() + (duration % 60));
      expiration.setMinutes(
        expiration.getMinutes() + Math.floor((duration % 3600) / 60)
      );
      expiration.setHours(expiration.getHours() + Math.floor(duration / 3600));
      const remainingTime = expiration - now;

      if (remainingTime <= 0) {
        clearInterval(intervalRef.current);
        onExpire();
        return;
      }

      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      if (minutes < 1 && hours < 1) {
        if (seconds <= 10) {
          setColor("text-red-600");
        } else {
          setColor("text-orange-800");
        }
      }

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer(); // inicial
    intervalRef.current = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalRef.current);
  }, [createdAt, duration, onExpire]);

  return <p className={`text-xs ${color}`}>{timeLeft}</p>;
}
