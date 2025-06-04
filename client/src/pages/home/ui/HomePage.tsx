import { useEffect } from "react";
import { TextField } from "@mui/material";

export const HomePage = () => {
  useEffect(() => {
    console.log("home page");
  }, []);

  return (
    <div className="home-page">
      <TextField label="Player Name" variant="outlined" />
    </div>
  );
};
