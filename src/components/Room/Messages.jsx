import React from "react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import formatDate from "../../../utils/utils";
import { deleteMessage, getMessages } from "../../../utils/message";
import { supabase } from "../../../utils/supabase";
import { useUser } from "../../../context/userContext";
import { useRoom } from "../../../context/roomContext";
import { subscribeToNewMessages, subscribeToSeenUpdates } from "../../../utils/suscriptions";
import MessageTimer from "./MessageTimer";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

export default function Messages() {
  const MemoizedMessageTimer = React.memo(MessageTimer);
  const { user } = useUser();
  const { room } = useRoom();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const visibleMessages = useMemo(() => messages, [messages]);

  const fetchMessages = useCallback(async () => {
    try {
      const dataMessages = await getMessages(room.id, user.id);
      console.log(dataMessages);
      if (dataMessages) {
        setMessages(dataMessages);
      }
    } catch (error) {
      toast.error("Error loading messages.");
      console.error(error.message);
    }
  }, [room, user]);

  useEffect(() => {
    // 1. carga inicial
    fetchMessages();

    // 2. suscripciones independientes
    const msgChannel = subscribeToNewMessages(
      room.id,
      user.id,
      setMessages
    );
    const seenChannel = subscribeToSeenUpdates(
      room.id,
      user.id,
      setMessages
    );

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(seenChannel)
    };
  }, [room.id, user.id, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages]);

  const handleExpire = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    deleteMessage(id).catch((err) => {
      console.error("Error deleting message:", err);
    });
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-2 mb-4 px-2 custom-scrollbar">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`p-2 rounded-md ${
              msg.id_user === user.id
                ? "bg-black border border-green-700 text-green-700 self-end ml-auto"
                : "bg-green-700 text-black"
            } max-w-xs`}
          >
            {msg.id_user !== user.id && msg.users?.username && (
              <div className="text-sm text-black font-bold mt-1">
                {msg.users.username}
              </div>
            )}
            {msg.content}
            <div
              className={`flex justify-between items-center text-xs mt-1 ${
                msg.id_user === user.id ? "text-slate-400 " : "text-slate-800"
              }`}
            >
              <span>{formatDate(msg.created_at)}</span>
              <MemoizedMessageTimer
                createdAt={msg.created_at}
                duration={room.messages_duration_seconds}
                onExpire={() => handleExpire(msg.id)}
              />
              <span>
                {msg.read_by_all == true ? (
                  <CheckCheck size={16} className="text-blue-300" />
                ) : (
                  <Check size={16} className="text-slate-300" />
                )}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
