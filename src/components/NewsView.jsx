import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePublicResources } from "../contexts/PublicResourcesContext";
/**
 * @brief Se encarga de renderizar la vista de noticas, es la vista detallada de las noticas
 */
const NewsView = () => {
  // Servicios del backend
  const { fetch_news_pdf } = usePublicResources();
  // Variables de estado
  const [isLoading, setIsLoading] = useState(true);
  const [pdf, setPdf] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  /**
   * @brief Se encarga de hacer el fetch de las noticas,y setear lavisualizacion del pdf
   */
  const handleBack = () => {
    navigate(-1);
  };
  const fetchData = useCallback(async () => {
    try {
      const news_pdf = await fetch_news_pdf(id);
      if (news_pdf) {
        setPdf(news_pdf);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id, fetch_news_pdf, setPdf]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //TODO ACA VOY A TENER QUE DECIDIR COMO SE VE LA VIEW ESTA
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            width: { xs: "95%", sm: "90%", md: "80%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <Box sx={{ width: "100%", padding: "16px", overflowY: "auto" }}>
            <Typography
              variant="h4"
              component="h4"
              gutterBottom
              sx={{ wordBreak: "break-word" }}
            >
              {pdf.title}
            </Typography>
            <Divider sx={{ width: "100%" }} />
          </Box>
          <Box
            component="img"
            src={pdf.imagen}
            alt={pdf.title}
            sx={{
              width: { xs: "95%", sm: "90%", md: "80%" },
              height: "auto",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <Typography
            variant="body1"
            component="p"
            sx={{
              maxWidth: "80%",
              padding: "16px",
              mt: 2,
              wordBreak: "break-word",
            }}
          >
            {pdf.abstract}
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              p: "24px",
            }}
          >
            <Button variant="contained" color="primary" onClick={handleBack}>
              Volver
            </Button>
            <a
              href={pdf.pdf}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!pdf.pdf}
            >
              <Button
                variant="contained"
                color="secondary"
                target="_blank"
                rel="noopener noreferrer"
                disabled={!pdf.pdf}
              >
                Ver PDF
              </Button>
            </a>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NewsView;
