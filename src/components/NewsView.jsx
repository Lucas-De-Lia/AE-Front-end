import {
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePublicResources } from "../contexts/PublicResourcesContext";
/**
 * @brief Se encarga de renderizar la vista de noticas, es la vista detallada de las noticas
 */
const NewsView = () => {
  // Servicios del backend
  const { fetch_news_pdf } = usePublicResources();
  // Variables de estado
  const [pdf, setPdf] = useState([]);
  const { id } = useParams();
  /**
   * @brief Se encarga de hacer el fetch de las noticas,y setear lavisualizacion del pdf
   */
  const fetchData = useCallback(async () => {
    try {
      const news_pdf = await fetch_news_pdf(id);
      if (news_pdf) {
        setPdf(news_pdf);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id, fetch_news_pdf, setPdf]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Paper
      sx={{
        width: "98vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container direction="column" style={{ flex: 1 }} spacing={2}>
        <Grid item>
          <Typography paddingTop={2} paddingBottom={2} variant="h5">
            {pdf.title}
          </Typography>
          <Divider />
        </Grid>
        <Grid item style={{ flex: 1 }}>
          {pdf.pdf ? (
            <embed
              title="PDF Viewer"
              src={`${process.env.REACT_APP_BACK_URL}/${pdf.pdf}`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "20vh",
              }}
            >
              <CircularProgress />
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NewsView;
