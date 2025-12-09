import { motion } from 'framer-motion';

export const TypingIndicator = () => {
  return (
    <div className="flex gap-1 py-1 pl-1">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          style={{
            width: '6px',
            height: '6px',
            backgroundColor: '#A0AEC0',
            borderRadius: '50%'
          }}
          animate={{
            y: [0, -5, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: dot * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};