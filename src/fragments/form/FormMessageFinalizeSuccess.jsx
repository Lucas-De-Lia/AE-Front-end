import { Box, Typography } from "@mui/material";
import React from "react";
import { useComponentMessageSuccessString } from "../../contexts/TextProvider.jsx";
import { superCenter } from "../../theme.jsx";
/**
 * @brief Mensaje de de exito en la finalizanción
 */
const FormMessageFinalizeSuccess = () => {
  //Variables de texto
  const menssagesuccesslabels = useComponentMessageSuccessString();
  return (
    <Box container="true" sx={{ ...superCenter, paddingBottom: 5 }}>
      <Typography variant="h4" color="success.main" gutterBottom>
        {menssagesuccesslabels.finalize.title}
      </Typography>
      <Typography variant="h6">
        {menssagesuccesslabels.finalize.body}
      </Typography>
    </Box>
  );
};
export default FormMessageFinalizeSuccess;
