import { supabase } from "./supabase";
import { getMessages } from "./message";

// Suscripción sólo a nuevos mensajes en la sala
export function subscribeToNewMessages(idRoom, idUser, setMessages) {
  const channel = supabase
    .channel(`messages-room-${idRoom}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `id_room=eq.${idRoom}`,
      },
      async (payload) => {
        console.log(payload)
        try {
          const data = await getMessages(idRoom, idUser);
          if (data) setMessages(data);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      }
    )
    .subscribe();

  return channel;
}

// Suscripción sólo a nuevos seen en message_seen (de cualquier sala)
export function subscribeToSeenUpdates(idRoom, idUser, setMessages) {
  const channel = supabase
    .channel(`seen-room-${idRoom}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "message_seen",
      },
      async (payload) => {
        console.log(payload)
        try {
          const data = await getMessages(idRoom, idUser);
          if (data) setMessages(data);
        } catch (err) {
          console.error("Error fetching seen updates:", err);
        }
      }
    )
    .subscribe();

  return channel;
}
