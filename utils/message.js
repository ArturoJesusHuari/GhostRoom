import { supabase } from "./supabase";

export const sendMessage = async (idRoom, idUser, newMessage) => {
  // 1. Insertar el mensaje
  const { data: messageData, error: messageError } = await supabase
    .from("messages")
    .insert({
      id_room: idRoom,
      id_user: idUser,
      content: newMessage.trim(),
    })
    .select(); // Necesitamos el ID del mensaje creado

  if (messageError) throw new Error(messageError.message);

  const messageId = messageData[0].id;

  // 2. Obtener todos los usuarios del room
  const { data: roomUsers, error: roomUsersError } = await supabase
    .from("room_user")
    .select("id_user")
    .eq("id_room", idRoom);
  if (roomUsersError) throw new Error(roomUsersError.message);
    
  // 3. Preparar inserts en message_seen
  const seenRecords = roomUsers.map(({ id_user }) => ({
    id_message: messageId,
    id_user,
    seen_at: id_user === idUser ? new Date().toISOString() : null,
  }));

  const { error: seenError } = await supabase
    .from("message_seen")
    .insert(seenRecords, { upsert: false }); // No debería haber duplicados, es un nuevo mensaje

  if (seenError) throw new Error(seenError.message);
};

export const getMessages = async (idRoom, idUser) => {
  // 1. Obtener mensajes
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("id, content, created_at ,id_user, users:users(id, username)")
    .eq("id_room", idRoom)
    .order("created_at", { ascending: true });
  if (messagesError) throw new Error(messagesError.message);

  const messageIds = messages.map((msg) => msg.id);
  if (!messageIds?.length || !idUser) return;
  
  // 2. Obtener usuarios del room
  const { data: roomUsers, error: roomUsersError } = await supabase
    .from("room_user")
    .select("id_user")
    .eq("id_room", idRoom);

  if (roomUsersError) throw new Error(roomUsersError.message);

  const userCount = roomUsers.length;

  // 3. Obtener registros de message_seen con seen_at NOT NULL
  const { data: seenData, error: seenError } = await supabase
    .from("message_seen")
    .select("id_message, seen_at")
    .in("id_message", messageIds)
    .not("seen_at", "is.null")
    
  if (seenError) throw new Error(seenError.message);

  // Agrupar por id_message para contar los vistos
  const seenCountMap = new Map();
  for (const { id_message } of seenData) {
    seenCountMap.set(id_message, (seenCountMap.get(id_message) || 0) + 1);
  }

  // 4. Marcar mensajes no vistos por este usuario
  const inserts = [];
  const updates = [];

  messageIds.forEach((msgId) => {
    const count = seenCountMap.get(msgId) || 0;
    // read_by_all
    const readByAll = count === userCount;

    // Agregar propiedad al mensaje
    const msgIndex = messages.findIndex((m) => m.id === msgId);
    messages[msgIndex].read_by_all = readByAll;
  });

  // 5. Marcar como leído por este usuario
  const { data: alreadySeen, error: alreadySeenError } = await supabase
    .from("message_seen")
    .select("id_message, seen_at")
    .in("id_message", messageIds)
    .eq("id_user", idUser);

  if (alreadySeenError) throw new Error(alreadySeenError.message);

  const seenMap = new Map(alreadySeen.map((r) => [r.id_message, r.seen_at]));

  messageIds.forEach((msgId) => {
    const seenAt = seenMap.get(msgId);
    if (!seenAt) {
      if (seenAt === undefined) {
        inserts.push({
          id_message: msgId,
          id_user: idUser,
          seen_at: new Date().toISOString(),
        });
      } else {
        updates.push(msgId);
      }
    }
  });

  if (inserts.length > 0) {
    await supabase.from("message_seen").insert(inserts);
  }

  if (updates.length > 0) {
    await Promise.all(
      updates.map((msgId) =>
        supabase
          .from("message_seen")
          .update({ seen_at: new Date().toISOString() })
          .eq("id_message", msgId)
          .eq("id_user", idUser)
      )
    );
  }

  return messages;
};

export const deleteMessage = async (messageId) => {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId);

  if (error) {
    throw new Error(error.message);
  }
};
