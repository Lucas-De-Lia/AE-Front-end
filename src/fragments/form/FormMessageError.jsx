import { Alert, Box, Typography } from "@mui/material";
import React from "react";
import { useComponentMessageErrorString } from "../../contexts/TextProvider.jsx";
import { boxErrorAESyle } from "../../theme.jsx";

/**
 * @brief Mensaje de error al enviar un alta de autoexlcusion.
 */
const FormMessageError = () => {
  // variables de texto
  const messageerrorlabels = useComponentMessageErrorString();
  return (
    <Box sx={boxErrorAESyle}>
      <Typography variant="h4" color="error" gutterBottom>
        {messageerrorlabels.title}
      </Typography>
      <Typography variant="h6" style={{ color: "red" }}>
        {messageerrorlabels.body}
      </Typography>
      <Alert paddingbottom={5} severity="error">
        {messageerrorlabels.alert_info.body.map((text, index) => (
          <Typography key={index}>{text}</Typography>
        ))}
      </Alert>
    </Box>
  );
};

export default FormMessageError;
