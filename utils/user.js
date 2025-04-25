import { supabase } from "./supabase";

export async function createUser() {
    // Generar un username aleatorio
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const username = `user${randomNumber}`;
    // Obtener la fecha actual en la zona horaria local y sumar 12 horas
    const now = new Date();
    now.setHours(now.getHours() + 12);
    const removalAt = now.toISOString();
    // Insertar nuevo usuario en Supabase
    const { data, error } = await supabase
        .from("users")
        .insert([{ username, removal_at: removalAt }])
        .select("id, username, removal_at")
        .single();
    return { data, error };

}
export async function getUser(id) {
    const { data, error } = await supabase
        .from("users")
        .select("username, removal_at")
        .eq("id", id)
        .single();
    return { data, error };

}
export async function deleteUser(id) {
    const { data, error } = await supabase.from("users").delete().eq("id", id);
    return { data, error };

}

export async function updateUser(id, username) {
    const { data, error } = await supabase.from("users").update({username: username}).eq("id", id);
    return { data, error };
}