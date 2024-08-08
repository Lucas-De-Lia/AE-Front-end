import React, { useRef, useState } from "react";
// Material-UI Components
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";

// Icons
import HowToRegIcon from "@mui/icons-material/HowToReg";

// Material-UI Components

// Contexts
import {
  useCommonsButtonString,
  useComponentAuthRegisterString,
} from "../contexts/TextProvider.jsx";

// Fragments
import {
  FormAddress,
  FormDatePlan,
  FormExtra,
  FormInfo,
  FormMessageError,
  FormMessageSuccess,
} from "../fragments/form/index.js";
// Styles
import { useNavigate } from "react-router-dom";
import { useService } from "../contexts/ServiceContext.js";
import ErrorPage from "../frames/ErrorPage.jsx";
import {
  cardRegisterStyle,
  centerButtonsStyle,
  centeringStyles,
  stepStyle,
} from "../theme.jsx";
import { fileToBase64, formatDate } from "../utiles.js";

/**
 * @brief Componente que muestra el formulario de registro.
 */
const AuthRegister = () => {
  // Variables con los textos
  const commonButtons = useCommonsButtonString();
  const authregisterlabels = useComponentAuthRegisterString();

  const navigate = useNavigate();
  // Servicios de backend
  const { registerRequest } = useService();

  // Referencia al formulario mostrado
  const dataRef = useRef(null);
  // Referencia al stepper
  const stepperRef = useRef(null);
  // Formulario actual (0,1,2,3);
  const [activeStep, setActiveStep] = useState(1);

  // Errores de los steps
  const [errors, setErrors] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  // Datos de los steps
  const [stepData, setStepData] = useState([
    {
      name: "",
      lastname: "",
      cuil: "",
      birthdate: "",
      gender: -1,
      password: "",
    },
    {
      state: "Ninguno",
      substate: "Ninguno",
      city: "Ninguno",
      address: "Ninguno",
      floor: "",
      number: "",
      apartment: "",
      postalCode: "",
    },
    { phone: "", email: "", files: [] },
    {
      startDay: "",
      fthMonth: "",
      sixMonth: "",
      lastMonth: "",
    },
  ]);

  // Variables de control al envio , visualizan un login y lockean el boton de envio para evitar enviar muchas requests antes de recivir la respuesta.
  const [loading, setLoading] = useState(false);
  const [lock, setLock] = useState(false);

  /**
   * @brief Se encarga de hacer la llamada al backend para registrar y setea los mensajes de exito/error.
   */
  const handleRegister = async () => {
    setLoading(true);
    try {
      let register_user = {
        cuil: stepData[0].cuil,
        email: stepData[2].email,
        password: stepData[0].password,
        firstname: stepData[0].name,
        lastname: stepData[0].lastname,
        birthdate: formatDate(new Date(stepData[0].birthdate)),
        gender: stepData[0].gender,
        address_number: stepData[1].number,
        floor: stepData[1].floor,
        apartment: stepData[1].apartment,
        postalcode: stepData[1].postalCode,
        province: stepData[1].state.nombre,
        city: `${stepData[1].substate.nombre} , ${stepData[1].city.nombre}`,
        address: stepData[1].address.nombre,
        phone: stepData[2].phone,
        startdate: formatDate(new Date()),
        dni: await fileToBase64(stepData[2].files[0]),
      };
      let result = await registerRequest(register_user);
      updateErrorAtIndex(4, !result);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  /**
   * @brief Funcion que renderiza el formulario correspondiente a la etapa i
   * */
  const StepperStage = (i) => {
    switch (i) {
      default:
        return <ErrorPage />;
      case 0:
        return (
          <FormInfo
            name={stepData[0].name}
            registerState={true}
            lastname={stepData[0].lastname}
            cuil={stepData[0].cuil}
            birthdate={stepData[0].birthdate}
            gender={stepData[0].gender}
            password={stepData[0].password}
            ref={dataRef}
          />
        );
      case 1:
        return (
          <FormAddress
            address={stepData[1].address}
            floor={stepData[1].floor}
            apartment={stepData[1].apartment}
            state={stepData[1].state}
            substate={stepData[1].substate}
            number={stepData[1].number}
            city={stepData[1].city}
            postalCode={stepData[1].postalCode}
            ref={dataRef}
          />
        );

      case 2:
        return (
          <FormExtra
            phone={stepData[2].phone}
            email={stepData[2].email}
            files={stepData[2].files}
            registerState={true}
            ref={dataRef}
          />
        );
      case 3:
        return loading ? (
          <Grid padding={12}>
            <CircularProgress />
          </Grid>
        ) : (
          <FormDatePlan first={true} ref={dataRef} email={stepData[2].email} />
        );

      case 4:
        return !errors[4] ? (
          <FormMessageSuccess first={true} />
        ) : (
          <FormMessageError padding={8} />
        );
    }
  };

  // Funciones para controlar el estado de los steps
  const handleBack = () => {
    let active = activeStep;
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    updateErrorAtIndex(active, false);
  };

  // controla el estado de la estructura errors
  const updateErrorAtIndex = (index, value) => {
    setErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = value;
      return newErrors;
    });
  };
  /**
   * @brief Se encarga de actualizar el estado de stepData con la informacion del ultimo paso
   */
  const updateStepData = (receivedData) => {
    setStepData((prevStepData) => {
      const newStepData = [...prevStepData];
      newStepData[activeStep] = { ...receivedData };
      return newStepData;
    });
  };

  /**
   * @brief Se encarga de manejar el paso siguiente y controlear los errores
   */
  const handleNext = async () => {
    let error = false;
    // Que exista la referencia al formulario visible y que posea una funcion handleErrors
    if (dataRef.current && typeof dataRef.current.handleErrors === "function") {
      error = await dataRef.current.handleErrors(); // verifico si tiene errores
      // error = true => tiene errores o false => no tiene
    }
    updateErrorAtIndex(activeStep, error); // actualizo errores
    if (!error) {
      // si no tiene errores
      if (activeStep <= 3) {
        // si es un paso valido actualizo los datos con los datos del formulario
        updateStepData(dataRef.current.getData());
        if (activeStep === 3) {
          // si es el ultimo paso de registro
          // bloqueo y envio la informacion al backend
          setLock(true);
          await handleRegister();
        }
      }
      // actualizo el paso al siguiente
      setActiveStep((prevstep) => prevstep + 1);
      // desbloqueo el boton .
      setLock(false);
    }
  };

  /**
   * @brief Se encarga de redirigir al login si y solo si se termino de registrar.
   */
  const handleLogin = () => {
    navigate("/auth/login");
  };

  const itLastState = (n = 0) =>
    activeStep === authregisterlabels.step_title.length - n;

  const itsFirstState = (i) => activeStep === i;

  return (
    <Card sx={cardRegisterStyle}>
      <CardHeader
        avatar={<HowToRegIcon />}
        titleTypographyProps={{ variant: "h6" }}
        title={authregisterlabels.title}
      />
      <Divider />
      <CardContent>
        <Stack>

            <Box padding={2}>{StepperStage(activeStep)}</Box>
         
          <Stepper
            ref={stepperRef}
            activeStep={activeStep}
            alternativeLabel
            sx={centeringStyles}
          >
            {!errors[4] &&
              authregisterlabels.step_title.map((label, index) => {
                let labelProps = {};
                labelProps.error = errors[index];
                return (
                  <Step id={label} key={label} sx={stepStyle}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
          </Stepper>
        </Stack>
      </CardContent>
      <CardActions sx={centerButtonsStyle}>
        <Button
          key="back-button"
          size="small"
          color="inherit"
          disabled={itsFirstState(0)}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          {commonButtons.back}
        </Button>
        <Button
          key="next-button"
          size="small"
          onClick={
            itLastState(0)
              ? errors[4]
                ? handleRegister
                : handleLogin
              : handleNext
          }
          disabled={lock}
        >
          {itLastState()
            ? errors[4]
              ? commonButtons.restart
              : commonButtons.login
            : itLastState(3)
            ? commonButtons.ok
            : commonButtons.next}
        </Button>
      </CardActions>
    </Card>
  );
};

export default AuthRegister;
