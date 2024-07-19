import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import { useLoadingAlertString } from "../contexts/TextProvider.jsx";
import AlertFragment from "./AlertFragmet.jsx";
/**
 * @brief Muestra un backlog con un CIrcular process , luego muestra una alerta de exito o fracaso
 */
const ProcessAlert = ({ open, loading, success }) => {
  const loadingalert = useLoadingAlertString();
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) =>
          Math.max.apply(Math, Object.values(theme.zIndex)) + 1,
      }}
    >
      {loading ? (
        <Paper>
          <Stack
            padding={4}
            spacing={5}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <CircularProgress />
            <Typography variant="body1">{loadingalert.process}</Typography>
          </Stack>
        </Paper>
      ) : success && !loading ? (
        <AlertFragment
          type={"success"}
          title={loadingalert.alert.success.title}
          body={loadingalert.alert.success.body}
          strong={loadingalert.alert.success.strong}
        />
      ) : (
        <AlertFragment
          type={"error"}
          title={loadingalert.alert.error.title}
          body={loadingalert.alert.error.body}
          strong={loadingalert.alert.error.strong}
        />
      )}
    </Backdrop>
  );
};

export default ProcessAlert;
