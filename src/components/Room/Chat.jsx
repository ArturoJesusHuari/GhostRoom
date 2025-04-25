import { useState } from "react";
import { useUser } from "../../../context/userContext";
import { sendMessage } from "../../../utils/message";
import { toast } from "react-hot-toast";
import { useRoom } from "../../../context/roomContext";
import Messages from "./Messages";

export default function Chat() {
  const { user } = useUser();
  const { room } = useRoom();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    setIsSending(true);
    try {
      await sendMessage(room.id, user.id, newMessage);
      setNewMessage("");
    } catch (error) {
      toast.error("Error sending message.");
      console.error("Error sending message:", error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] border border-green-500 rounded-lg p-4 bg-black text-green-300">
      <Messages />

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 p-2 rounded text-green-200 outline-none border border-green-500"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600 disabled:opacity-50"
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
