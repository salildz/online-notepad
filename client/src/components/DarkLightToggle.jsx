import { Box } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useTheme } from "./ThemeContext";

function DarkLightToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "15px",
        mt: 1,
      }}
    >
      <Box
        onClick={toggleMode}
        sx={{
          width: "70px",
          height: "34px",
          backgroundColor: mode === "dark" ? "#333" : "#ddd",
          borderRadius: "17px",
          position: "relative",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
        }}
      >
        <DarkMode
          sx={{
            fontSize: "16px",
            color: mode === "dark" ? "#fff" : "#888",
            transition: "color 1s",
          }}
        />

        <LightMode
          sx={{
            fontSize: "16px",
            color: mode === "light" ? "#ffa726" : "#888",
            transition: "color 1s",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "3px",
            left: mode === "dark" ? "3px" : "37px",
            width: "28px",
            height: "28px",
            borderRadius: "14px",
            backgroundColor: "white",
            transition: "left 0.5s",
          }}
        />
      </Box>
    </Box>
  );
}

export default DarkLightToggle;
