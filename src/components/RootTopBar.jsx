import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery, useTheme } from "@mui/material";
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
import MenuButton from "../fragments/topbar/MenuButtom.jsx";
import {
  boxSMmenu,
  iconButtonTopStyle,
  logoTopStyle,
  menuStyles,
} from "../theme.jsx";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { motion } from "framer-motion";
/**
 * @brief Muestra el encabezado de la página
 */
const RootTopBar = (props) => {
  // Variables de textos
  const labels = useRootTopbarString();

  // Ancla del menu desplegable
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [hover, setHover] = useState(false);
  // Servicios del backend
  const { User, serverDates, isAuthenticated, AE } = useService();
  const navigate = useNavigate();

  const today = useMemo(() => new Date(), []);

  // Opciones del menu
  const pages = useMemo(
    () => [
      { label: labels.titles[0], disabled: false, show: true },
      { label: labels.titles[1], disabled: false, show: true },
      {
        label: labels.titles[2],
        disabled: User !== null ? User.ae !== AE.NON_AE : false,
        show: true,
        Popper:
          "Este botón está deshabilitado porque ya tienes una autoexclusion activa.",
      },
      {
        label: labels.titles[3],
        show: User !== null && User.ae === AE.FINISHABLE,
        disabled:
          serverDates !== null
            ? today < serverDates.fifthMonth || today > serverDates.sixthMonth
            : true,
        Popper:
          "Este botón está deshabilitado porque no estás en la fecha indicada o no es tu primera exclusión.",
      },
      {
        label: "Encuesta AE",
        disabled: User === null || User?.respondioEncuesta,
        show: true,
        Popper:
          "Usted ya respondió la encuesta o no es posible responderla en este momento",
      },
    ],
    [User, serverDates, labels, today, AE, User?.respondioEncuesta]
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
      case 4:
        navigate("/ae/survey");
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
              <Box sx={{ display: isMobile ? "flex" : "none" }}>
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
              </Box>
            )}
            <img
              src={labels.logo.src}
              loading="lazy"
              alt="Logo imagen"
              onClick={handleLogoClick}
              style={logoTopStyle}
            />
            {isAuthenticated &&
              !isMobile &&
              pages.map(
                (page, index) =>
                  page.show && (
                    <MenuButton
                      key={page.label + "-menu-buttons-appbar"}
                      page={page}
                      onClick={(e) => handleoOnClickMenu(e, index)}
                    />
                  )
              )}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: !useMediaQuery("(max-width:600px)") ? "flex" : "none",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></Box>
          <Box
            sx={{
              flexGrow: 1,
              display: useMediaQuery("(max-width:600px)") ? "flex" : "none",
            }}
          />
          {!isAuthenticated && !isMobile && (
            <motion.div
              className="box"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              onHoverStart={() => setHover(true)}
              onHoverEnd={() => setHover(false)}
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
                onClick={() => navigate("/auth/register")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 12px",
                  cursor: "pointer",
                }}
              >
                <HowToRegIcon
                  sx={{
                    fontSize: 24,
                    marginRight: "6px",
                    ml: "6px",
                  }}
                />
                <Typography variant="body4">Excluirse</Typography>
              </div>
            </motion.div>
          )}
          <IconUserMenu userAuth={isAuthenticated} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default RootTopBar;
