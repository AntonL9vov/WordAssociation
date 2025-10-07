import { Chip } from "@mui/material";

interface FeatureProps {
  label: string;
  icon: React.ReactElement;
  color: string;
  textColor: string;
  iconColor: string;
  style: React.CSSProperties;
  size: "small" | "medium";
}

export const Feature = ({
  label,
  icon,
  color,
  textColor,
  iconColor,
  style,
  size,
}: FeatureProps) => {
  return (
    <Chip
      label={label}
      icon={icon}
      size={size}
      sx={{
        backgroundColor: color,
        color: textColor,
        fontWeight: "medium",
        "& .MuiChip-icon": {
          color: iconColor,
        },
        ...style,
      }}
    />
  );
};
