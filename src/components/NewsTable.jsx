import {
  Box,
  Divider,
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
import { centeringStyles } from "../theme.jsx";
import { isMobileDevice } from "../utiles.js";
import AlertFragment from "../fragments/AlertFragmet.jsx";
import { useNewsInfoAlert } from "../contexts/TextProvider.jsx";

const NewsCard = lazy(() => import("./NewsCard.jsx"));

/**
 * This function takes in an array of PDFs and returns a view of 3 PDFs in a row.
 * @param {PDF[]} news - An array of news objects, each representing a PDFs.
 * @returns {JSX.Element} A view of 3 PDFs in a row.
 */
const NewsTable = () => {
  const theme = useTheme();

  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const itemsPerPage = isMobileDevice()
    ? 1
    : isMediumScreen
    ? isSmallScreen
      ? 1
      : 2
    : 3;

  const { fetch_news_list } = usePublicResources();
  const [fetchNews, setFetchNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const labels_news = useNewsInfoAlert();

  const visibleNewss = useMemo(
    () => fetchNews,
    [fetchNews ]
  );
  const fetchDataCallback = useCallback(async () => {
    try {
      const fetch_news = await fetch_news_list(currentPage,itemsPerPage);
      console.log(fetch_news);
      const totalItems = fetch_news.total;
      //console.log(totalItems)
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

  useEffect(() => {
    if(fetchNews.length === 0){
      fetchData();
    }
  },[]);

  const handlePageChange = async (_event, page) => {
    console.log(page);
    const fetch_news = await fetch_news_list(page,itemsPerPage);
    console.log(fetch_news);
    setFetchNews(fetch_news.data);
    setCurrentPage(page);
  }
  //
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
            <Grid container paddingTop={3} spacing={3} sx={{ ...centeringStyles }}>
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
