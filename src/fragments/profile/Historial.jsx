import React, { useCallback, useEffect, useMemo, useState } from "react";
// Material-UI Components
import {
  Box,
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  debounce,
  tableCellClasses,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useService } from "../../contexts/ServiceContext";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const estados = [
  "Vigente",
  "Renovado",
  "Pendiente de val.",
  "Baja voluntaria",
  "Vencido",
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Historial = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fetchAE, setFetchAE] = useState([]);
  const { fetch_history } = useService();

  // ---------------------------- CAMBIAR ----------------------------------
  const visibleAE = useMemo(() => fetchAE, [fetchAE]);

  /**
   * @brief Se encarga de hacer el fetch de las noticas y calcula los datos necesarios para la paginacion
   */
  const fetchDataCallback = useCallback(async () => {
    try {
      const fetch_hst = await fetch_history(page + 1, rowsPerPage);
      //console.log(fetch_hst);
      const totalItems = fetch_hst.total;
      setTotalPages(Math.ceil(totalItems / rowsPerPage));
      setFetchAE(fetch_hst.data);
    } catch (error) {
      console.error(error);
      setFetchAE([]);
    }
  }, [fetch_history, rowsPerPage]);

  const fetchData = useMemo(
    () => debounce(fetchDataCallback, 500),
    [fetchDataCallback]
  );

  useEffect(() => {
    if (fetchAE.length === 0) {
      fetchData();
    }
  }, []);

  // ---------------------------- CAMBIAR ----------------------------------
  const emptyRows =
    page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - visibleAE.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {visibleAE && (
        <Paper sx={{ borderRadius: "7px" }}>
          <TableContainer sx={{ paddingBottom: 1 }}>
            <Table sx={{ minWidth: 650, padding: 1 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Fecha de Inicio</StyledTableCell>
                  <StyledTableCell>Fecha de Fin</StyledTableCell>
                  <StyledTableCell>Estado</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsPerPage > 0 &&
                  visibleAE.map((row) => (
                    <TableRow key={row.id_estado}>
                      <StyledTableCell component="th" scope="row">
                        {row.fecha_ae}
                      </StyledTableCell>
                      <StyledTableCell>{row.fecha_cierre_ae}</StyledTableCell>
                      <StyledTableCell>
                        {estados[row.id_nombre_estado - 1]}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <StyledTableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={3}
                    count={totalPages}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    slotProps={{
                      select: {
                        inputProps: {
                          "aria-label": "rows per page",
                        },
                        native: true,
                      },
                    }}
                    labelRowsPerPage={"Filas por pagina"}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
};

export default Historial;
