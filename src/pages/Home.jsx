import { useEffect, useState } from "react";
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

const descriptions = [
  "A private chat system where security comes first.",
  "Encrypted, anonymous, and always under your control.",
  "No logs. No traces. Just pure privacy.",
  "Your secrets are safe — even from us.",
  "GhostRoom: Because privacy is power.",
];

const RotatingDescription = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % descriptions.length);
    }, 4000); // cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.p
      key={index} // reinicia animación al cambiar
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="mt-4 text-green-300"
    >
      {descriptions[index]}
    </motion.p>
  );
};

function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6" transition-style="in:wipe:cinematic">
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
          alt="GhostRoom's Ghost"
          className="w-16 h-16 mx-auto opacity-80 drop-shadow-[0_0_2px_#00ff00]"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        </div>

        <RotatingDescription />

        {/* "Hacker" style button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 border border-green-400 text-green-400 bg-black font-mono hover:bg-green-400 hover:text-black transition-all"
        >
          <Link to="/profile" className="flex items-center gap-2">
            Log In <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.button>
      </div>
    </div>
  );
}

export default Home;
