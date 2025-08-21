import { Box, Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import { gridNewsCardBoxStyle, gridNewsCardStyle } from "../theme.jsx";
import NewsView from "./NewsView.jsx";

/**
 * @brief Se encarga de mostrar una noticia en un card
 */
const NewsCard = React.memo(({ anews }) => {
  const navigate = useNavigate();
  // Controla la visibilidad de la noticia segun se carga.
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);

  // desestructura la noticia
  const { titulo_principal, texto_principal, images } = anews;
  const urls = images.split(",");
  // Redirige a una vista mas detallada
  const handleReadMoreClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const endLoading = async () => {
    setLoad(true);
  };

  return (
    <>
      <motion.div
        className="box"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card
          sx={{
            ...gridNewsCardStyle,
            display: "flex",
            flexDirection: "column",
            maxWidth: "98vw",
          }}
        >
          {!load && <Skeleton variant="rectangular" width={400} height={50} />}
          <LazyLoadImage
            src={`${process.env.REACT_APP_BACK_URL}/${urls[0]}`}
            alt={titulo_principal}
            title={titulo_principal}
            beforeLoad={endLoading}
            style={{
              scale: "1",
              height: "25vh",
              width: "100%",
              objectFit: "cover",
            }}
          />
          <Box sx={gridNewsCardBoxStyle}>
            <CardContent sx={{ p: 2, flexGrow: 1, overflow: "hidden" }}>
              <Typography
                gutterBottom
                variant="h5"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "1.5rem",
                  height: "3rem",
                }}
              >
                {titulo_principal}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "1.5rem",
                  height: "4.1rem",
                }}
              >
                {texto_principal}
              </Typography>
            </CardContent>
          </Box>
          <CardActions>
            <Button size="small" onClick={handleReadMoreClick}>
              Leer más
            </Button>
          </CardActions>
        </Card>
      </motion.div>
      <NewsView open={open} close={handleClose} news={anews} />
    </>
  );
});

export default NewsCard;
