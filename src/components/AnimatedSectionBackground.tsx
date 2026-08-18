import React from "react";

interface AnimatedSectionBackgroundProps {
  imageUrl?: string;
  overlayGradient?: string;
  animationType?: "kenburns" | "float" | "pulse";
  className?: string;
  opacity?: number;
}

export const AnimatedSectionBackground: React.FC<AnimatedSectionBackgroundProps> = ({
  imageUrl,
  overlayGradient = "linear-gradient(to bottom, rgba(14, 16, 21, 0.94), rgba(7, 8, 11, 0.97))",
  animationType = "kenburns",
  className = "",
  opacity = 1
}) => {
  if (!imageUrl) return null;

  let animClass = "animate-bg-kenburns";
  if (animationType === "float") animClass = "animate-bg-float";
  if (animationType === "pulse") animClass = "animate-bg-pulse";

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {/* Animated Image Layer with GPU Acceleration */}
      <div
        className={`absolute -inset-[8%] w-[116%] h-[116%] bg-cover bg-center will-change-transform transform-gpu ${animClass}`}
        style={{
          backgroundImage: `url("${imageUrl}")`,
          opacity
        }}
      />
      {/* High-Contrast Gradient Dark Overlay for Crystal-Clear Text Legibility */}
      <div
        className="absolute inset-0"
        style={{ background: overlayGradient }}
      />
      {/* Subtle Radial Ambient Gold Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,180,92,0.06)_0%,transparent_70%)]" />
    </div>
  );
};

export default AnimatedSectionBackground;
