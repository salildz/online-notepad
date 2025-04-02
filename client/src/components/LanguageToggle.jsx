import { Box, InputAdornment, MenuItem, Select, Typography } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { useTranslation } from "../../node_modules/react-i18next";

function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = (id) => {
    const newLanguage = id.target.value;
    i18n.changeLanguage(newLanguage);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingRight: "15px",
        mt: 1,
        gap: 1,
      }}
    >
      <Select
        value={currentLanguage || "tr"}
        startAdornment={
          <InputAdornment position="start">
            <TranslateIcon fontSize="small" />
          </InputAdornment>
        }
        onChange={toggleLanguage}
        size="small"
        sx={{
          minWidth: 100,
          "& .MuiSelect-select": {
            py: 0.5,
          },
        }}
      >
        <MenuItem value="tr-TR">Türkçe</MenuItem>
        <MenuItem value="en-US">English</MenuItem>
      </Select>
    </Box>
  );
}

export default LanguageToggle;
