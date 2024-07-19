import { Backdrop, CircularProgress, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import { centeringStyles } from "../theme.jsx";

import CheckIcon from "@mui/icons-material/Check";
/**
 * @brief Email backdrop informa el resultado de enviar el email de verificación.
 */
const EmailBackdrop = ({ open, loading }) => {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) =>
          Math.max.apply(Math, Object.values(theme.zIndex)) + 1,
      }}
    >
      <Paper>
        <Box padding={4}>
          {/*animacion de enviado*/}
          {loading ? (
            <CircularProgress />
          ) : (
            <Stack sx={centeringStyles}>
              <CheckIcon fontSize="large" color="success" />
              <Typography> Email enviado </Typography>
            </Stack>
          )}
        </Box>
      </Paper>
    </Backdrop>
  );
};

export default EmailBackdrop;
