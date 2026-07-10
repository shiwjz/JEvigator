import { motion } from "motion/react";
import { useEffect, useState } from "react";

// 풀잎 떨어지는 애니메이션 (그린바이오)
export function FallingLeaves() {
  const [leaves, setLeaves] = useState<Array<{ id: number; left: number; delay: number; duration: number; swayPattern: number[] }>>([]);

  useEffect(() => {
    const newLeaves = Array.from({ length: 15 }, (_, i) => {
      // 각 풀잎마다 랜덤한 좌우 흔들림 패턴 생성
      const swayIntensity = 20 + Math.random() * 40; // 20~60 사이의 랜덤 강도
      const swayPattern = [
        0,
        (Math.random() - 0.5) * swayIntensity,
        (Math.random() - 0.5) * swayIntensity,
        (Math.random() - 0.5) * swayIntensity,
        (Math.random() - 0.5) * swayIntensity,
        (Math.random() - 0.5) * swayIntensity,
        0
      ];
      
      return {
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4,
        swayPattern,
      };
    });
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ y: -50, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "100vh",
            x: leaf.swayPattern,
            rotate: [0, 180, 360, 540, 720],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${leaf.left}%`,
            fontSize: "24px",
          }}
        >
          🍃
        </motion.div>
      ))}
    </div>
  );
}

// 약 떨어지는 애니메이션 (레드바이오)
export function FallingPills() {
  const [pills, setPills] = useState<Array<{ id: number; left: number; delay: number; duration: number; emoji: string; swayPattern: number[] }>>([]);

  useEffect(() => {
    const pillEmojis = ["💊", "💉", "🧪", "⚕️"];
    const newPills = Array.from({ length: 12 }, (_, i) => {
      // 각 약마다 랜덤한 좌우 흔들림 패턴 생성
      const swayIntensity = 15 + Math.random() * 35; // 15~50 사이의 랜덤 강도
      const swayPattern = [
        0,
        (Math.random() - 0.5) * swayIntensity,
        (Math.random() - 0.5) * swayIntensity,
        (Math.random() - 0.5) * swayIntensity,
        (Math.random() - 0.5) * swayIntensity,
        0
      ];
      
      return {
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 7 + Math.random() * 3,
        emoji: pillEmojis[Math.floor(Math.random() * pillEmojis.length)],
        swayPattern,
      };
    });
    setPills(newPills);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pills.map((pill) => (
        <motion.div
          key={pill.id}
          initial={{ y: -50, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "100vh",
            x: pill.swayPattern,
            rotate: [0, 360, 720],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: pill.duration,
            delay: pill.delay,
            repeat: Infinity,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            left: `${pill.left}%`,
            fontSize: "28px",
          }}
        >
          {pill.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// 파도 쓸어가는 애니메이션 (해양뷰티바이오)
export function WavesAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 하단에서 올라오는 파도 레이어 */}
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          initial={{ y: "100%" }}
          animate={{
            y: ["100%", "-10%", "100%"],
          }}
          transition={{
            duration: 4 + index * 0.5,
            delay: index * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: `radial-gradient(ellipse at bottom, rgba(59, 130, 246, ${0.15 - index * 0.03}), transparent 70%)`,
            filter: "blur(2px)",
          }}
        />
      ))}
      
      {/* 파도 물결 효과 */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={`wave-${index}`}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{
            scaleY: [0, 1.2, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 3,
            delay: index * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            bottom: `${index * 10}%`,
            left: 0,
            right: 0,
            height: "30%",
            background: `linear-gradient(to top, rgba(96, 165, 250, ${0.2 - index * 0.05}), transparent)`,
            borderRadius: "50% 50% 0 0",
            transformOrigin: "bottom",
          }}
        />
      ))}

      {/* 물보라 효과 */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`splash-${i}`}
          initial={{ y: "100%", scale: 0, opacity: 0 }}
          animate={{
            y: [
              "100%",
              `${20 + Math.random() * 60}%`,
              "100%"
            ],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 4,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            bottom: 0,
            fontSize: "16px",
          }}
        >
          💦
        </motion.div>
      ))}
    </div>
  );
}

// 직접입력 - 반짝이는 효과
export function SparklesAnimation() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; left: number; top: number; delay: number }>>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            fontSize: "20px",
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}