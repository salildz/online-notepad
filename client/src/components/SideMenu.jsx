import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import { useAuth } from "./AuthContext";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Button } from "@mui/material";
import { useTranslation } from "../../node_modules/react-i18next";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const { username, email } = useAuth();
  const { t } = useTranslation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt={username}
          sx={{ width: 36, height: 36 }}
        >
          {username && username[0].toUpperCase()}
        </Avatar>
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {username}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary" }}
          >
            {email}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
      </Box>
      <Stack sx={{ p: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LogoutRoundedIcon />}
        >
          {t("auth.logout")}
        </Button>
      </Stack>
    </Drawer>
  );
}
