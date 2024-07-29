import { Box, Typography } from "@mui/material";
import React, { useImperativeHandle, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useService } from "../../contexts/ServiceContext.js";
import { useFormDatePlanString } from "../../contexts/TextProvider.jsx";
import { getDates } from "../../utiles.js";

const SITE_KEY = process.env.REACT_APP_SITE_KEY;
/**
 * @brief Step del formulario de registro, es la parte encargada de informar al usuario de los plazos en caso de registrarse y mostrar el captcha.
 */
const FormDatePlan = React.forwardRef((props, ref) => {
  // Variables de texto
  const formdateplanlabels = useFormDatePlanString();
  // Servicios del backend
  const { verifyCaptcha } = useService();
  // Referencia al captcha
  const refCaptcha = useRef();
  //Obtiene las fechas para hoy
  const { startDay, fthMonth, sixMonth, lastMonth } = getDates();

  const [errors, setErrors] = useState(true);

  const getData = () => {
    return {
      startDay: startDay,
      fthMonth: fthMonth,
      sixMonth: sixMonth,
      lastMonth: lastMonth,
    };
  };
  /**
   * @brief Verifica si el captcha se realizo correctamente.
   */
  const handleErrors = async () => {
    let response = await verifyCaptcha(refCaptcha.current.getValue());
    if (response.success) {
      setErrors(!response.success);
    }
    return errors;
  };

  useImperativeHandle(ref, () => ({
    handleErrors,
    getData,
  }));

  const successCaptcha = () => {
    setErrors(false);
  };

  const errorCaptcha = () => {
    setErrors(true);
  };

  return (
    <Box
      paddingBottom={3}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" color="primary" gutterBottom>
        {formdateplanlabels.title}
      </Typography>

      <Typography variant="h6">
        {formdateplanlabels.body[0]}
        {startDay.toLocaleDateString("en-GB")}
      </Typography>

      {props.first && (
        <Typography variant="h6">
          {formdateplanlabels.body[1]}
          {fthMonth.toLocaleDateString("en-GB")}
          {formdateplanlabels.body[2]}
          {sixMonth.toLocaleDateString("en-GB")}.
        </Typography>
      )}
      <Typography variant="h6">
        {props.first ? formdateplanlabels.body[3] : formdateplanlabels.body[4]}
        {lastMonth.toLocaleDateString("en-GB")}.
      </Typography>
      <Typography paddingBottom={3} variant="h6">
        {formdateplanlabels.body[5]}
      </Typography>
      <ReCAPTCHA
        ref={refCaptcha}
        onChange={successCaptcha}
        onErrored={errorCaptcha}
        onEmptied={errorCaptcha}
        sitekey={SITE_KEY}
      />
    </Box>
  );
});
export default FormDatePlan;
