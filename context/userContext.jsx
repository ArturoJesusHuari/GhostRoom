import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getUser, createUser, deleteUser } from "../utils/user";

// Creación del contexto
const UserContext = createContext();

// Hook personalizado para acceder al contexto
export const useUser = () => useContext(UserContext);

// Función auxiliar para obtener el ID almacenado
const getStoredUserId = () => localStorage.getItem("userId") ?? null;

// Función auxiliar para guardar el ID del usuario
const storeUserId = (id) => localStorage.setItem("userId", id);

// Función auxiliar para eliminar el usuario almacenado
const removeStoredUserId = async (id) => {
  await deleteUser(id);
  localStorage.removeItem("userId");
};

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    username: null,
    removal_at: null,
  });
  const [loading, setLoading] = useState(true);
  // Función para cargar el usuario
  const fetchUser = useCallback(async () => {
    try {
      const storedUserId = getStoredUserId();
      console.log(storedUserId)
      if (storedUserId) {
        const { data, error } = await getUser(storedUserId);
        if (error) {
          console.error("Error al obtener el usuario:", error);
          localStorage.removeItem("userId");
          return;
        }

        if (data) {
          const now = new Date();
          const removalTime = data.removal_at
            ? new Date(data.removal_at)
            : null;

          if (!removalTime || removalTime <= now) {
            await removeStoredUserId(storedUserId);
          } else {
            setUser({
              id: storedUserId,
              username: data.username,
              removal_at: data.removal_at,
            });
          }
        }
      } else {
        const { data, error } = await createUser();
        if (error) {
          console.error("Error al crear el usuario:", error);
          return;
        }

        if (data?.id) {
          console.log("Usuario creado:", data);
          storeUserId(data.id);
          console.log("ID guardado en localStorage:", getStoredUserId());
          setUser({
            id: data.id,
            username: data.username,
            removal_at: data.removal_at,
          });
        } else {
          console.warn("Respuesta inválida de createUser:", data);
        }
      }
    } catch (err) {
      console.error("Error en fetchUser:", err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchUser();
    setLoading(false);
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
