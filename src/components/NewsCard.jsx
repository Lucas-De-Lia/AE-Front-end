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

/**
 * @brief Se encarga de mostrar una noticia en un card
 */
const NewsCard = React.memo(({ anews }) => {
  const navigate = useNavigate();
  // Controla la visibilidad de la noticia segun se carga.
  const [load, setLoad] = useState(false);

  // desestructura la noticia
  const { id, url, title, abstract } = anews;

  // Redirige a una vista mas detallada
  const handleReadMoreClick = () => {
    navigate(`/document/${id}`);
  };

  const endLoading = async () => {
    setLoad(true);
  };

  return (
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
          src={`${process.env.REACT_APP_BACK_URL}/${url}`}
          alt={title}
          title={title}
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
            <Typography gutterBottom variant="h5">
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 4, // Número de líneas que querés mostrar
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.5rem", // Ajusta si usás otra
                height: "6rem", // 4 líneas × lineHeight
              }}
            >
              {abstract}
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
  );
});

export default NewsCard;
