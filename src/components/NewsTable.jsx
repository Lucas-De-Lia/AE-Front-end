import {
  Box,
  Grid,
  Grow,
  Pagination,
  Skeleton,
  Stack,
  debounce,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { lazy, useCallback, useEffect, useMemo, useState } from "react";
import { usePublicResources } from "../contexts/PublicResourcesContext";
import { useNewsInfoAlert } from "../contexts/TextProvider.jsx";
import AlertFragment from "../fragments/AlertFragmet.jsx";
import { centeringStyles } from "../theme.jsx";
import { isMobileDevice } from "../utiles.js";

const NewsCard = lazy(() => import("./NewsCard.jsx"));

/**
 * @brief Se encarga de renderizar la tabla de noticas, haciendo el fetch de las noticias, la paginacion y crea las NewsCards
 */
const NewsTable = () => {
  // Variables de texto
  const labels_news = useNewsInfoAlert();

  const theme = useTheme();

  // Media queries para obtener la cantidad optima de noticis para la vista
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const itemsPerPage = isMobileDevice()
    ? 1
    : isMediumScreen
    ? isSmallScreen
      ? 1
      : 2
    : 3;

  // Servicios del backend
  const { fetch_news_list } = usePublicResources();

  // Variables de estado
  const [fetchNews, setFetchNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const visibleNewss = useMemo(() => fetchNews, [fetchNews]);

  /**
   * @brief Se encarga de hacer el fetch de las noticas y calcula los datos necesarios para la paginacion
   */
  const fetchDataCallback = useCallback(async () => {
    try {
      const fetch_news = await fetch_news_list(currentPage, itemsPerPage);
      const totalItems = fetch_news.total;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      setFetchNews(fetch_news.data);
    } catch (error) {
      console.error(error);
      setFetchNews([]);
    }
  }, [fetch_news_list, itemsPerPage]);

  const fetchData = useMemo(
    () => debounce(fetchDataCallback, 500),
    [fetchDataCallback]
  );

  /**
   * @brief Se encarga de cambiar la pagina, haciendo el nuevo fetch
   */
  const handlePageChange = async (_event, page) => {
    let pagefind = page;
    let fetch_news = await fetch_news_list(pagefind, itemsPerPage);
    if (!fetch_news.data.length > 0) {
      // Esto es para que si tengo cargada en memoria una pagina y justo borran esa pagina,lo que haga es visualizar la anterior a esa pagina.
      fetch_news = await fetch_news_list(pagefind - 1, itemsPerPage);
      pagefind = page - 1;
    }
    const totalItems = fetch_news.total;
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
    setFetchNews(fetch_news.data);
    setCurrentPage(pagefind);
  };

  useEffect(() => {
    if (fetchNews.length === 0) {
      fetchData();
    }
  }, []);

  return (
    <>
      <AlertFragment
        type={"info"}
        title={labels_news.alert.info.title}
        body={labels_news.alert.info.body}
      />
      <Stack
        sx={{
          display: "flex",
          ...centeringStyles,
        }}
      >
        {fetchNews.length > 0 ? (
          <>
            <Grid
              container
              paddingTop={3}
              spacing={3}
              sx={{ ...centeringStyles }}
            >
              {visibleNewss.map((element, index) => (
                <Grow in={true} key={index}>
                  <Grid item key={index}>
                    <NewsCard anews={element} />
                  </Grid>
                </Grow>
              ))}
            </Grid>
            <Box
              mt={5}
              sx={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Skeleton variant="rectangular" width={"50vw"} height={"50vh"} />
          </Box>
        )}
      </Stack>
    </>
  );
};

export default NewsTable;
