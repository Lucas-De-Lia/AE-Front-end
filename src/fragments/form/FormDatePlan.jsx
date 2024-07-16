import { Box, Typography } from "@mui/material";
import React, { useImperativeHandle, useRef, useState } from "react";
import { useFormDatePlanString } from "../../contexts/TextProvider.jsx";
import { getDates } from "../../utiles.js";
import ReCAPTCHA from "react-google-recaptcha";
import { useService } from "../../contexts/ServiceContext.js";


const SITE_KEY = process.env.REACT_APP_SITE_KEY;

const FormDatePlan = React.forwardRef((props, ref) => {
  const { startDay, fthMonth, sixMonth, lastMonth } = getDates();
  const formdateplanlabels = useFormDatePlanString();

  const [errors, setErrors] = useState(true);

  const getData = () => {
    return {
      startDay: startDay,
      fthMonth: fthMonth,
      sixMonth: sixMonth,
      lastMonth: lastMonth,
    };
  };

  const handleErrors = () => {
    return errors;
  };

  useImperativeHandle(ref, () => ({
    handleErrors,
    getData,
  }));

  const { verifyCaptcha } = useService();
  const refCaptcha = useRef();

  const successCaptcha = async () => {
    let response = await verifyCaptcha(refCaptcha.current.getValue());
    if(response.data.success){
      setErrors(!response.data.success);
    }
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
