import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Animación del título (tipeo digital)
const terminalText = "GhostRoom: Chat Secreto y Seguro_";
const typingEffect = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: { delay: i * 0.05 },
  }),
};

// Fondo dinámico estilo "lluvia de código"
const BackgroundMatrix = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-green-600 opacity-20 text-lg font-bold"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {String.fromCharCode(33 + Math.random() * 94)}
        </motion.span>
      ))}
    </div>
  );
};

function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6">
      <BackgroundMatrix />

      <div className="border border-green-400 p-8 w-full max-w-3xl bg-black bg-opacity-80">
        <div className="flex">
        <h1 className="text-3xl md:text-4xl font-bold mt-4">
          {terminalText.split("").map((char, i) => (
            <motion.span key={i} custom={i} variants={typingEffect} initial="hidden" animate="visible">
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.img
          src="./ghost.png"
          alt="Fantasma de GhostRoom"
          className="w-16 h-16 mx-auto opacity-80 drop-shadow-[0_0_2px_#00ff00]"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        </div>

        {/* Descripción con efecto de parpadeo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="mt-4 text-green-300"
        >
          Un sistema de chat privado donde la seguridad es lo primero.
        </motion.p>

        {/* Botón con estilo "hacker" */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 border border-green-400 text-green-400 bg-black font-mono hover:bg-green-400 hover:text-black transition-all"
        >
          <Link to="/settings" className="flex items-center gap-2">
            Iniciar Sesión <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.button>
      </div>
    </div>
  );
}

export default Home;
