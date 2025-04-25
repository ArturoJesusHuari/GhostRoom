import { useState } from "react";
import { Link } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import { X, Menu } from "lucide-react";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="relative flex flex-row items-center justify-between py-4 px-2 bg-black border-b border-green-400 text-green-400 font-mono">
      {/* Botón de menú para móviles */}
      <button onClick={toggleMenu} className="sm:hidden text-green-400">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Modal de navegación en pantallas pequeñas */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-2xl space-y-6 z-50">
          <button onClick={toggleMenu} className="absolute top-2 right-2 text-green-400">
            <X size={32} />
          </button>
          <Link to="/rooms" className="hover:text-green-300 transition" onClick={toggleMenu}>
            Rooms
          </Link>
          <Link to="/settings" className="hover:text-green-300 transition" onClick={toggleMenu}>
            Settings
          </Link>
        </div>
      )}

      {/* Contenedor para enlaces en pantallas grandes */}
      <div className="hidden sm:flex items-center gap-6">
        <Link to="/rooms" className="hover:text-green-300 transition">
          Rooms
        </Link>
        <Link to="/settings" className="hover:text-green-300 transition">
          Settings
        </Link>
      </div>
      {/*
      <div className="text-center sm:text-left">
        <CountdownTimer />
      </div>*/}
    </nav>
  );
};

export default Nav;