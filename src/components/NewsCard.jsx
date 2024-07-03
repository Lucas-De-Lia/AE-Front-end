import { Box, Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import { gridNewsCardBoxStyle, gridNewsCardStyle } from "../theme.jsx";
import { motion } from "framer-motion";

const NewsCard = React.memo(({ anews }) => {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  const { id, url, title, abstract } = anews;

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
      <Card sx={gridNewsCardStyle}>
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
          <CardContent>
            <Typography gutterBottom variant="h5">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
