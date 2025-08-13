import { Box, Dialog, Divider, IconButton, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePublicResources } from "../contexts/PublicResourcesContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
/**
 * @brief Se encarga de renderizar la vista de noticas, es la vista detallada de las noticas
 */

//TODO: Crear pantalla mobile.
//TODO: MANEJAR CON EL BOTON DE VER MAS LA APARICION Y DESAPARICION DEL DIALOG
//TODO: ANALIZAR SI QUEDA ASI -> SI
//TODO:                         -> MODIFICAR BDD Y SISTEMON
//TODO:                       -> NO
//TODO:                         -> REVEER EL DISEÑO
//? SE PODRIA AGREGAR UNA "PÁGINA" MAS PARA QUE CONTENGA SOLO TEXTO, Y ESA SERIA OPCIONAL
//? POSIBLES TEXTOS OPCIONALES: ENCABEZADOS Y EL TEXTO DEL FINAL DE LA PAGINA
const NewsView = () => {
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
  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {};

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
      open={true}
      onClose={handleClose}
      scroll="paper"
      PaperProps={{
        sx: {
          width: "80vw",
          maxWidth: "80vw",
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
          }}
        >
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // centra horizontalmente
            justifyContent: "flex-start", // alinea arriba
            height: "auto",
          }}
        >
          <Typography
            variant="h2"
            color="#3b785f"
            sx={{
              fontSize: "5.5rem",
              fontWeight: "bold",
              mb: 3,
              width: "80%",
              textAlign: "center",
            }}
          >
            NOTICIAS DEL DÍA
          </Typography>
          <Divider color="#3b785f" width="80%" sx={{ borderBottomWidth: 3 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              mt: 2,
              mb: 2,
              width: "80%",
            }}
          >
            <Typography>https://www.loteriasantafe.gov.ar/</Typography>
            <Typography>
              Primera Junta 2724, Ciudad de Santa Fe (CP3000)
            </Typography>
          </Box>
          <Divider color="#3b785f" width="80%" sx={{ borderBottomWidth: 3 }} />
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              width: "80%",
              mt: 2,
              mb: 2,
            }}
          >
            Últimos acontecimientos de nuestro Entorno
          </Typography>
          <Box
            sx={{
              display: "flex",
              width: "80%",
              gap: 2,
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              component="img"
              src="https://www.pixartprinting.it/blog/wp-content/uploads/2021/06/1_Mona_Lisa_300ppi.jpg"
              alt="Mona Lisa"
              sx={{
                objectFit: "cover",
                objectPosition: "top",
                width: "65%",
                height: "70vh",
              }}
            ></Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "35%",
                maxHeight: "60%",
              }}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
              <Typography sx={{ fontWeight: "light", fontSize: "1rem" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </Typography>
            </Box>
          </Box>
          <Divider color="#3b785f" width="80%" sx={{ borderBottomWidth: 3 }} />
          <Typography
            sx={{
              fontWeight: "bold",
              width: "80%",
              fontSize: "1.5rem",
              mt: 2,
              mb: 3,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, width: "80%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "65%",
              }}
            >
              <Typography
                sx={{
                  columnCount: 2,
                  columnGap: "40px",
                  textAlign: "justify",
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
                dolore magna aliqua. Lorem ipsums
              </Typography>
              <Typography
                sx={{
                  fontWeight: "bold",
                  width: "100%",
                  fontSize: "1.5rem",
                  mt: 2,
                  mb: 3,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Typography>
            </Box>
            <Box
              component="img"
              src="https://www.pixartprinting.it/blog/wp-content/uploads/2021/06/1_Mona_Lisa_300ppi.jpg"
              alt="Mona Lisa"
              sx={{
                width: "35%",
                height: "auto",
                objectFit: "cover",
                objectPosition: "top",
                mt: 1,
              }}
            ></Box>
          </Box>
          <Divider
            color="#3b785f"
            width="80%"
            sx={{ borderBottomWidth: 3, mb: 3, mt: 3 }}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default NewsView;
