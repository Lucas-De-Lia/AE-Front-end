import { Chip, Paper, Skeleton, useTheme } from "@mui/material";
import { Container } from "@mui/system";
import React, { Suspense, useState } from "react";
import { useRootFooterString } from "../contexts/TextProvider.jsx";
import {
  Xl,
  containerChipsFooterStyle,
  containerChipsFooterStyleSm,
  footerPaperStyle,
  imgLogoProvStyle,
} from "../theme.jsx";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import { isMobileDevice } from "../utiles.js";

/**
 * @brief Muestra el pie de la página
 */
const RootFooter = () => {
  const theme = useTheme();

  // Variables de textos
  const rootfooterlabels = useRootFooterString();

  // Variables de estado
  const [hoveredChip, setHoveredChip] = useState(null);

  const handleMouseEnter = (chip) => {
    setHoveredChip(chip);
  };

  const handleMouseLeave = () => {
    setHoveredChip(null);
  };

  /**
   * @brief Maneja la accion al clickear un chip
   */
  const handleSendMessage = (contactType) => {
    if (contactType === "email") {
      // Abre la aplicación de correo electrónico predeterminada
      window.open("mailto:" + rootfooterlabels.email);
    } else if (contactType === "phone") {
      if (isMobileDevice()) {
        // Si es un dispositivo móvil, abrir la aplicación de teléfono
        window.open("tel:" + rootfooterlabels.phone);
      } else {
        // Si es un escritorio, abrir WhatsApp
        window.open(
          "https://web.whatsapp.com/send?phone=" + rootfooterlabels.phone
        );
      }
    } else if (contactType === "address") {
      // Busca la dirección en Google Maps
      window.open(
        "https://www.google.com/maps/search/?api=1&query=" +
          rootfooterlabels.address
      );
    }
  };

  return (
    <Paper elevation={2} sx={footerPaperStyle}>
      <Container sx={Xl}>
        <Suspense fallback={<Skeleton variant="rectangular" />}>
          <img
            src={rootfooterlabels.logo.src}
            loading="lazy"
            alt=""
            style={imgLogoProvStyle}
          />
        </Suspense>
        <Container sx={containerChipsFooterStyle}>
          <Chip
            clickable
            icon={
              <PlaceIcon
                style={{
                  color: hoveredChip === "address" ? "#ffffff" : "inherit",
                }}
              />
            }
            label={rootfooterlabels.address}
            onMouseEnter={() => handleMouseEnter("address")}
            onClick={() => handleSendMessage("address")}
            onMouseLeave={handleMouseLeave}
            style={{
              marginRight: "5px",
              backgroundColor:
                hoveredChip === "address"
                  ? theme.palette.primary.main
                  : "inherit",
              color: hoveredChip === "address" ? "#ffffff" : "inherit",
            }}
          />
          <Chip
            clickable
            icon={
              <PhoneIcon
                style={{
                  color: hoveredChip === "phone" ? "#ffffff" : "inherit",
                }}
              />
            }
            label={rootfooterlabels.phone}
            onMouseEnter={() => handleMouseEnter("phone")}
            onClick={() => handleSendMessage("phone")}
            onMouseLeave={handleMouseLeave}
            style={{
              marginRight: "5px",
              backgroundColor:
                hoveredChip === "phone"
                  ? theme.palette.primary.main
                  : "inherit",
              color: hoveredChip === "phone" ? "#ffffff" : "inherit",
            }}
          />
          <Chip
            clickable
            icon={
              <EmailIcon
                style={{
                  color: hoveredChip === "email" ? "#ffffff" : "inherit",
                }}
              />
            }
            label={rootfooterlabels.email}
            onMouseEnter={() => handleMouseEnter("email")}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleSendMessage("email")}
            style={{
              marginRight: "5px",
              backgroundColor:
                hoveredChip === "email"
                  ? theme.palette.primary.main
                  : "inherit",
              color: hoveredChip === "email" ? "#ffffff" : "inherit",
            }}
          />
        </Container>
      </Container>
      {/** Footer pantalla pequeña */}
      <Container>
        <Container sx={containerChipsFooterStyleSm}>
          <Chip
            clickable
            icon={
              <PlaceIcon
                style={{
                  color: hoveredChip === "address" ? "#ffffff" : "inherit",
                }}
              />
            }
            label={rootfooterlabels.address}
            onMouseEnter={() => handleMouseEnter("address")}
            onClick={() => handleSendMessage("address")}
            onMouseLeave={handleMouseLeave}
            style={{
              marginRight: "5px",
              backgroundColor:
                hoveredChip === "address"
                  ? theme.palette.primary.main
                  : "inherit",
              color: hoveredChip === "address" ? "#ffffff" : "inherit",
            }}
          />
          <Chip
            clickable
            icon={
              <PhoneIcon
                style={{
                  color: hoveredChip === "phone" ? "#ffffff" : "inherit",
                }}
              />
            }
            label={rootfooterlabels.phone}
            onMouseEnter={() => handleMouseEnter("phone")}
            onClick={() => handleSendMessage("phone")}
            onMouseLeave={handleMouseLeave}
            style={{
              marginRight: "5px",
              backgroundColor:
                hoveredChip === "phone"
                  ? theme.palette.primary.main
                  : "inherit",
              color: hoveredChip === "phone" ? "#ffffff" : "inherit",
            }}
          />
          <Chip
            clickable
            icon={
              <EmailIcon
                style={{
                  color: hoveredChip === "email" ? "#ffffff" : "inherit",
                }}
              />
            }
            label={rootfooterlabels.email}
            onClick={() => handleSendMessage("email")}
            onMouseEnter={() => handleMouseEnter("email")}
            onMouseLeave={handleMouseLeave}
            style={{
              marginRight: "5px",
              backgroundColor:
                hoveredChip === "email"
                  ? theme.palette.primary.main
                  : "inherit",
              color: hoveredChip === "email" ? "#ffffff" : "inherit",
            }}
          />
        </Container>
      </Container>
    </Paper>
  );
};

export default RootFooter;
