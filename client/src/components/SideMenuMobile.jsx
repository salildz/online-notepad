import * as React from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuContent from "./MenuContent";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

function SideMenuMobile({ open, toggleDrawer }) {
  const { username, email, clearToken } = useAuth();
  const { t } = useTranslation(["translation", "serverErrors"]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearToken();
      Navigate("/login");
    } catch (error) {
      clearToken();
      navigate("/login");
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: "70dvw",
          height: "100%",
        }}
      >
        <Stack
          direction="row"
          sx={{ p: 2, pb: 0, gap: 1 }}
        >
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={username}
              sx={{ width: 24, height: 24 }}
            >
              {username && username[0].toUpperCase()}
            </Avatar>
            <Typography
              component="p"
              variant="h6"
            >
              {username}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
          >
            {t("auth.logout")}
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;
