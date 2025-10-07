import React from "react";
import { Box } from "@mui/material";

interface LogoProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export const Logo: React.FC<LogoProps> = ({
  size = 100,
  color = "var(--primary-500)",
  backgroundColor = "var(--primary-dark)",
  strokeColor = "var(--primary-700)",
  strokeWidth = 3,
}) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Наклонные линии */}
        <line
          x1="70"
          y1="180"
          x2="10"
          y2="20"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <line
          x1="130"
          y1="180"
          x2="190"
          y2="20"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Треугольник */}
        <polygon
          points="40,20 80,20 40,60"
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Квадрат */}
        <rect
          x="55"
          y="80"
          width="35"
          height="35"
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Ромб */}
        <polygon
          points="140,20 165,40 140,60 115,40"
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Камень (многоугольник) - поднят на уровень квадрата и сделан симметричным */}
        <polygon
          points="130,80 150,100 130,120 110,100"
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Круг */}
        <circle
          cx="100"
          cy="160"
          r="15"
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </svg>
    </Box>
  );
};
