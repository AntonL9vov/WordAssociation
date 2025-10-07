import { Box } from "@mui/material";
import { AutoAwesome as SparkleIcon } from "@mui/icons-material";
import { Feature } from "@/shared";

interface AuthFormFeaturesProps {
  features: string[];
}

export const AuthFormFeatures = ({ features }: AuthFormFeaturesProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        justifyContent: "center",
      }}
    >
      {features.map((feature, index) => (
        <Feature
          key={index}
          label={feature}
          size="small"
          icon={<SparkleIcon sx={{ fontSize: "16px !important" }} />}
          color="var(--accent-100)"
          textColor="var(--accent-700)"
          iconColor="var(--accent-600)"
          style={{
            fontWeight: "medium",
          }}
        />
      ))}
    </Box>
  );
};
