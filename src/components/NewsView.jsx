import { Box, Dialog, Divider, IconButton, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePublicResources } from "../contexts/PublicResourcesContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Carousel from "react-material-ui-carousel";
/**
 * @brief Se encarga de renderizar la vista de noticas, es la vista detallada de las noticas
 */

//TODO: ANALIZAR SI QUEDA ASI -> SI
//TODO:                         -> MODIFICAR BDD Y SISTEMON

const images = [
  "https://www.pixartprinting.it/blog/wp-content/uploads/2021/06/1_Mona_Lisa_300ppi.jpg",
  "https://www.pixartprinting.it/blog/wp-content/uploads/2021/06/1_Mona_Lisa_300ppi.jpg",
  "https://www.pixartprinting.it/blog/wp-content/uploads/2021/06/1_Mona_Lisa_300ppi.jpg",
];
const NewsView = ({ open, close }) => {
  // Servicios del backend
  const { fetch_news_pdf } = usePublicResources();
  // Variables de estado
  const [isLoading, setIsLoading] = useState(true);
  const [noticia, setNoticia] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  /**
   * @brief Se encarga de hacer el fetch de las noticas,y setear lavisualizacion del pdf
   */

  const fetchData = useCallback(async () => {
    try {
      const news = await fetch_news_pdf(id);
      if (news) {
        setNoticia(news);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id, fetch_news_pdf, setNoticia]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={close}
      scroll="paper"
      PaperProps={{
        sx: {
          width: { xs: "95vw", sm: "90vw", md: "80vw" },
          maxWidth: { xs: "95vw", sm: "90vw", md: "80vw" },
          height: "99vh", // crece con el contenido
          maxHeight: "99vh",
          margin: 0,
        },
      }}
    >
      <Box sx={{ height: "100%", overflowY: "auto", position: "relative" }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            ml: 4,
            mt: 2,
            zIndex: 10,
            background: "white",
            p: 1,
            opacity: 0.7,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={close}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={close}>
            <PictureAsPdfIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: { xs: "center", md: "space-between" },
              alignItems: { xs: "center", md: "center" },
              flexWrap: { xs: "wrap", md: "nowrap" },
              width: "80%",
            }}
          >
            <Box
              component="img"
              src="/images/logo.webp"
              alt="Logo Lotería de Santa Fe"
              sx={{ width: "200px", height: "auto", mb: 1 }}
            ></Box>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1.5rem", md: "3.5rem" },
                color: "#4c4468 ",
              }}
            >
              JUEGO RESPONSABLE
            </Typography>
          </Box>
          <Divider
            sx={{
              width: "80%",
              height: "3px", // grosor de la línea
              backgroundImage: `linear-gradient(
      120deg,
      rgba(255, 203, 2, 0.631) 0%,
      rgba(255, 116, 2, 0.631) 33%,
      rgba(228, 33, 83, 0.631) 66%,
      rgba(60, 58, 229, 0.631) 100%
    )`,
              border: "none", // sin borde por defecto
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: { xs: "center", md: "space-around" },
              alignItems: { xs: "center", md: "center" },
              flexWrap: { xs: "wrap", md: "nowrap" },
              mt: 2,
              mb: 2,
              width: "80%",
            }}
          >
            <Typography sx={{ textAlign: "center" }}>
              14 de agosto de 2025
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
              Tiempo estimado de lectura: 3 min
            </Typography>
          </Box>
          <Divider
            sx={{
              width: "80%",
              height: "3px", // grosor de la línea
              backgroundImage: `linear-gradient(
      120deg,
      rgba(255, 203, 2, 0.631) 0%,
      rgba(255, 116, 2, 0.631) 33%,
      rgba(228, 33, 83, 0.631) 66%,
      rgba(60, 58, 229, 0.631) 100%
    )`,
              border: "none", // sin borde por defecto
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              width: "80%",
              mt: 2,
              mb: 2,
              fontSize: { xs: "1.5rem", md: "3.5rem" },
            }}
          >
            Últimos acontecimientos de nuestro Entorno
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
              gap: 2,
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Carousel
              autoPlay
              animation="fade"
              indicators={true}
              navButtonsAlwaysVisible={false}
              sx={{
                width: "100%",
              }}
            >
              {images.map((src, index) => (
                <Box
                  key={index}
                  component="img"
                  src={src}
                  alt={`Slide ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "500px",
                    objectPosition: "top",
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              ))}
            </Carousel>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "light",
                  fontSize: "1rem",
                  textAlign: "justify",
                  columnCount: {
                    xs: 1,
                    sm: 2,
                    md: 3,
                  },
                  columnGap: "40px",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor
                sit amet, consectetur adipisicing elit. Placeat consequatur
                animi tempora odio, provident, sunt vitae eligendi officiis
                aperiam quisquam voluptates pariatur eos sequi numquam
                repudiandae. Vel consequatur unde quia! Lorem ipsum dolor sit
                amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Lorem ipsum dolor sit amet,
                consectetur adipisicing elit. Placeat consequatur animi tempora
                odio, provident, sunt vitae eligendi officiis aperiam quisquam
                voluptates pariatur eos sequi numquam repudiandae. Vel
                consequatur unde quia!
              </Typography>
            </Box>
          </Box>
          <Divider
            sx={{
              width: "80%",
              height: "3px", // grosor de la línea
              backgroundImage: `linear-gradient(
      120deg,
      rgba(255, 203, 2, 0.631) 0%,
      rgba(255, 116, 2, 0.631) 33%,
      rgba(228, 33, 83, 0.631) 66%,
      rgba(60, 58, 229, 0.631) 100%
    )`,
              border: "none", // sin borde por defecto
              mb: 2,
            }}
          />
          <Box sx={{ display: "flex", gap: 2, width: "80%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  mb: 2,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
              <Typography
                sx={{
                  columnGap: "40px",
                  textAlign: "justify",
                  columnCount: {
                    xs: 1,
                    sm: 2,
                    md: 3,
                  },
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor
                sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Lorem ipsums Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Quibusdam, deserunt. Beatae aut
                dolore cumque quis. Consequuntur corporis explicabo id rerum,
                necessitatibus dolor delectus iste ut quasi velit, quis soluta.
                Placeat.
              </Typography>
            </Box>
          </Box>
          <Divider
            sx={{
              width: "80%",
              height: "3px", // grosor de la línea
              backgroundImage: `linear-gradient(
      120deg,
      rgba(255, 203, 2, 0.631) 0%,
      rgba(255, 116, 2, 0.631) 33%,
      rgba(228, 33, 83, 0.631) 66%,
      rgba(60, 58, 229, 0.631) 100%
    )`,
              border: "none", // sin borde por defecto
              mt: 3,
              mb: 3,
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: { xs: "wrap", md: "nowrap" },
              mb: 2,
              width: "80%",
              textAlign: "center",
            }}
          >
            <Typography>https://www.loteriasantafe.gov.ar/</Typography>
            <Typography>
              Primera Junta 2724, Ciudad de Santa Fe (CP3000)
            </Typography>
          </Box>
          <Divider
            sx={{
              width: "80%",
              height: "3px", // grosor de la línea
              backgroundImage: `linear-gradient(
      120deg,
      rgba(255, 203, 2, 0.631) 0%,
      rgba(255, 116, 2, 0.631) 33%,
      rgba(228, 33, 83, 0.631) 66%,
      rgba(60, 58, 229, 0.631) 100%
    )`,
              border: "none", // sin borde por defecto
              mb: 2,
            }}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default NewsView;
