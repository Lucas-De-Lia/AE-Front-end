import {
  Box,
  Dialog,
  Divider,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Carousel from "react-material-ui-carousel";
/**
 * @brief Se encarga de renderizar la vista de noticas, es la vista detallada de las noticas
 */

const NewsView = ({ open, close, news }) => {
  function formatearFecha(fechaString) {
    // Crear objeto Date a partir del string
    const fecha = new Date(fechaString.replace(" ", "T"));
    // → "2025-08-19T12:05:03"

    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()]; // 0 = enero
    const anio = fecha.getFullYear();

    return `${dia} de ${mes} de ${anio}`;
  }
  const {
    id,
    titulo_principal,
    texto_principal,
    titulo_secundario,
    texto_secundario,
    tiempo_lectura,
    file_path,
    created_at,
    images,
  } = news;
  const urls = images.split(",");
  const fecha = formatearFecha(created_at);
  /**
   * @brief Se encarga de hacer el fetch de las noticas,y setear lavisualizacion del pdf
   */

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
          {file_path !== null && (
            <Link
              href={`${process.env.REACT_APP_BACK_URL}/${file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Ver PDF"
            >
              <PictureAsPdfIcon />
            </Link>
          )}
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
            <Typography sx={{ textAlign: "center" }}>{fecha}</Typography>
            <Typography sx={{ textAlign: "center" }}>
              Tiempo estimado de lectura: {tiempo_lectura || "5"} min
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
            {titulo_principal}
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
              {urls.map((src, index) => (
                <Box
                  key={index}
                  component="img"
                  src={`${process.env.REACT_APP_BACK_URL}/${src}`}
                  alt={`Slide ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "500px",
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
                {texto_principal}
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
                {titulo_secundario}
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
                {texto_secundario}
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
