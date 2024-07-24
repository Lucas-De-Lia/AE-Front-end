import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useService } from "../contexts/ServiceContext.js";
import { useRootTopbarString } from "../contexts/TextProvider.jsx";
import IconUserMenu from "../fragments/topbar/IconUserMenu.jsx";
import {
  boxSMmenu,
  iconButtonTopStyle,
  logoTopStyle,
  menuStyles,
} from "../theme.jsx";

/**
 * @brief Muestra el encabezado de la página
 */
const RootTopBar = (props) => {
  // Variables de textos
  const labels = useRootTopbarString();

  // Ancla del menu desplegable
  const [anchorElNav, setAnchorElNav] = useState(null);
  // Servicios del backend
  const { User, serverDates, isAuthenticated, AE } = useService();

  const navigate = useNavigate();

  const today = useMemo(() => new Date(), []);

  // Opciones del menu
  const pages = useMemo(
    () => [
      { label: labels.titles[0], disabled: false },
      { label: labels.titles[1], disabled: false },
      {
        label: labels.titles[2],
        disabled: User !== null ? User.ae !== AE.NON_AE : false,
      },
      {
        label: labels.titles[3],
        disabled:
          User !== null && User.ae === AE.FINISHABLE
            ? today < serverDates.fifthMonth || today > serverDates.sixthMonth
            : true,
      },
    ],
    [User, serverDates, labels, today, AE]
  );

  /**
   * @brief Maneja la accion al clickear un chip
   */
  const handleoOnClickMenu = (e, index) => {
    switch (index) {
      case 1:
        navigate("/ae/profile");
        break;
      case 2:
        navigate("/ae/create");
        break;
      case 3:
        navigate("/ae/finalize");
        break;
      case 0:
        navigate("/");
        break;
      default:
        navigate("error");
    }
    handleCloseNavMenu();
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      color={"inherit"}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Container>
        <Toolbar disableGutters>
          <Box sx={boxSMmenu}>
            {isAuthenticated && (
              <>
                <IconButton {...iconButtonTopStyle} onClick={handleOpenNavMenu}>
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  {...menuStyles}
                  size="small"
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                >
                  {pages.map(
                    (page, index) =>
                      !page.disabled && (
                        <MenuItem
                          key={page.label + "-menu-appbar"}
                          disabled={page.disabled ? "true" : undefined}
                          onClick={(e) => handleoOnClickMenu(e, index)}
                        >
                          <Typography
                            textAlign="center"
                            paddingBlockStart={"5px"}
                          >
                            {page.label}
                          </Typography>
                        </MenuItem>
                      )
                  )}
                </Menu>
              </>
            )}
            <img
              src={labels.logo.src}
              loading="lazy"
              alt="Logo imagen"
              onClick={handleLogoClick}
              style={logoTopStyle}
            />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: !useMediaQuery("(max-width:600px)") ? "flex" : "none",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">Control de Acceso al Juego</Typography>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: useMediaQuery("(max-width:600px)") ? "flex" : "none",
            }}
          />
          <IconUserMenu userAuth={isAuthenticated} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default RootTopBar;
