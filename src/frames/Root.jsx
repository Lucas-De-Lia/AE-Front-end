import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Box,
  CircularProgress,
  Fab,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import React, { Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import RootFooter from "../components/RootFooter.jsx";
import RootTopBar from "../components/RootTopBar.jsx";
import { centeringStyles } from "../theme.jsx";

export default function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  const itsHelp = () => location.pathname === "/faq";

  const handleHelp = () => {
    if (itsHelp()) {
      navigate(-1);
    } else {
      navigate("/faq");
    }
  };
  return (
    <React.Fragment>
      <RootTopBar />
      <Box
        id="scrollable-content"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "100vh",
          maxWidth: "98vw",
          ...centeringStyles,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            paddingTop: 10,
            paddingBottom: 10,
            ...centeringStyles,
          }}
        >
          <Suspense
            fallback={
              <Paper>
                <Stack
                  padding={8}
                  direction="column"
                  sx={centeringStyles}
                  spacing={2}
                >
                  <CircularProgress />
                  <Typography>{"Cargando..."}</Typography>
                </Stack>
              </Paper>
            }
          >
            <Outlet />
          </Suspense>
        </Box>
        <RootFooter />
      </Box>
      <div style={{ position: "fixed", bottom: 16, right: 16 }}>
        <Fab
          size="medium"
          aria-label="Ayuda"
          variant="extended"
          onClick={handleHelp}
          style={{
            backgroundColor: blue[800],
            color: "white",
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          {itsHelp() ? (
            <>
              <ArrowBackIcon sx={{ mr: 1 }} />
              {"Volver"}
            </>
          ) : (
            <>
              <HelpOutlineIcon sx={{ mr: 1 }} />
              {"Ayuda"}
            </>
          )}
        </Fab>
      </div>
    </React.Fragment>
  );
}
