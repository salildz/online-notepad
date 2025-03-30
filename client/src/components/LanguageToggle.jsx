import { Box } from "@mui/material";
import { useTranslation } from "../../node_modules/react-i18next";

function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "tr" : "en";
    i18n.changeLanguage(newLanguage);
  };

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
        onClick={toggleLanguage}
        sx={{
          width: "70px",
          height: "34px",
          backgroundColor: currentLanguage === "tr" ? "#333" : "#ddd",
          borderRadius: "17px",
          position: "relative",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
        }}
      >
        <Box
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            color: currentLanguage === "tr" ? "#fff" : "#888",
            transition: "color 1s",
          }}
        >
          TR
        </Box>

        <Box
          sx={{
            fontSize: "16px",
            fontWeight: "bold",
            color: currentLanguage === "en" ? "#333" : "#888",
            transition: "color 1s",
          }}
        >
          EN
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "3px",
            left: currentLanguage === "tr" ? "3px" : "37px",
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

export default LanguageToggle;
