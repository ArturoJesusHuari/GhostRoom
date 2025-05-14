import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { getUser, createUser } from "../utils/user";

// Creación del contexto
const UserContext = createContext();

// Hook personalizado para acceder al contexto
export const useUser = () => useContext(UserContext);

// Función auxiliar para obtener el ID almacenado
const getStoredUserId = () => localStorage.getItem("userId") ?? null;

// Función auxiliar para guardar el ID del usuario
const storeUserId = (id) => localStorage.setItem("userId", id);

// Función auxiliar para eliminar el usuario almacenado
const removeStoredUserId = () => {
  localStorage.removeItem("userId");
};

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
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
      if (storedUserId) {
        const { data, error } = await getUser(storedUserId);
        if (error) {
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
          storeUserId(data.id);
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
    const initialize = async () => {
      setLoading(true);
      await fetchUser(); 
      setLoading(false);
    };

    initialize();
  }, [fetchUser, navigate]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser ,loading }}>
      {children}
    </UserContext.Provider>
  );
};
