import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";

import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import React, { useState } from "react";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonIcon from "@mui/icons-material/Person";
import { stringAvatar } from "../../utiles.js";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useService } from "../../contexts/ServiceContext.js";
import { useMediaQuery, useTheme } from "@mui/material";

// Opciones cuando esta logeado
const settings = [{ label: "Cerrar sesión", icon: <ExitToAppIcon />, id: 5 }];
// Opciones cuando no esta logeado
const settings_login = [
  { label: "Acceso", icon: <LockOpenIcon />, id: 1 },
  { label: "Excluirse", icon: <HowToRegIcon />, id: 2 },
];
/**
 * @brief Boton interactivo para ingresar y salir de la cuenta.
 */
const IconUserMenu = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Servicios con el backend
  const { User, isAuthenticated, unauthenticate } = useService();
  // Variables de estado
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [hover, setHover] = useState(false);
  // constantes
  const loginPath = "/auth/login";
  const registerPath = "/auth/register";
  const avatarname = isAuthenticated
    ? stringAvatar(User.name + " " + User.lastname)
    : stringAvatar("N N");

  const navigate = useNavigate();

  /**
   * @brief Funcioens encargadas de abrir y cerrar el menu
   */
  const logout = async () => {
    await unauthenticate()
      .then(() => navigate("/", { replace: true }))
      .catch((e) => console.error("Error during logout: ", e))
      .finally(() => setAnchorElUser(null));
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const reloadOrRedirect = (path) => {
    // SI estoy en la pagina y vuelvo apretar el mismo boton recarga
    // Si no estoy , redirige a esta
    if (window.location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
      setAnchorElUser(null);
    }
  };

  const onClickMenu = async (e, id) => {
    const actions = {
      [settings_login[0].id]: () => reloadOrRedirect(loginPath),
      [settings_login[1].id]: () => reloadOrRedirect(registerPath),
      [settings[0].id]: logout,
      default: () => navigate("error"),
    };
    const action = actions[id] || actions.default;
    await action();
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <>
        <motion.div
          className="box"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          onHoverStart={(e) => {
            setHover(true);
          }}
          onHoverEnd={(e) => {
            setHover(false);
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid transparent",
            borderRadius: "7px",
            marginRight: "10px",
            ...(hover && {
              backgroundImage:
                "linear-gradient(white,white), linear-gradient(120deg,rgba(255, 203, 2, 0.631) 0%, rgba(255, 116, 2, 0.631) 33%, rgba(228, 33, 83, 0.631) 66%, rgba(60, 58, 229, 0.631) 100%)",
              borderImageSlice: "1",
              backgroundOrigin: "border-box",
              backgroundClip: "content-box, border-box",
            }),
          }}
        >
          <div
            onClick={handleOpenUserMenu}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingRight: 10,
              paddingLeft: 10,
            }}
          >
            {!props.userAuth && (
              <Typography variant="body4" sx={{ width: { xs: "max-content" } }}>
                {isMobile ? "Ingresar / Excluirse" : "Ingresar"}
              </Typography>
            )}
            <Tooltip title="Menu">
              <IconButton sx={{ p: "5px" }}>
                {props.userAuth ? (
                  <Avatar
                    sx={{ ...avatarname.sx, width: 40, height: 40 }}
                    variant="rounded"
                  >
                    {avatarname.children}
                  </Avatar>
                ) : (
                  <>
                    <Avatar sx={{ width: 40, height: 40 }} variant="rounded">
                      <PersonIcon />
                    </Avatar>
                  </>
                )}
              </IconButton>
            </Tooltip>
          </div>
        </motion.div>
        <Menu
          edge="end"
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          size="small"
          overflow="hidden"
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {(props.userAuth ? settings : settings_login).map((setting) => (
            <MenuItem
              size="small"
              key={setting.label + "menu-icon"}
              onClick={(e) => onClickMenu(e, setting.id)}
              sx={{ display: !isMobile && setting.id === 2 && "none" }}
            >
              {setting.icon}
              <Typography textAlign="center" paddingBlockStart={"5px"}>
                {setting.label}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </>
    </Box>
  );
};
export default IconUserMenu;
