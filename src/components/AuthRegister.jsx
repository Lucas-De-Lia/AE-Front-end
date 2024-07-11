import React, { Suspense, useRef, useState } from "react";

// Material-UI Components
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
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
  FormFileAttach,
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
import { formatDate } from "../utiles.js";

/**
 * The RegisterCard component is a multi-step form that allows users to register by providing various information.
 * The component uses state hooks to manage the current step, errors, skipped steps, and step data. It also uses refs to access data and handle errors in child components.
 * @function
 * @returns {JSX.Element} The RegisterCard component.
 */
const AuthRegister = () => {
  const commonButtons = useCommonsButtonString();
  const authregisterlabels = useComponentAuthRegisterString();
  const navigate = useNavigate();

  const [errors, setErrors] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [activeStep, setActiveStep] = useState(2);
  const [lock, setLock] = useState(false);
  const stepperRef = useRef(null);

  const dataRef = useRef(null);
  const { registerRequest } = useService();

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
    { occupation: "NC", study: "NC", phone: "", email: "" },
    { files: [] },
    {
      startDay: "",
      fthMonth: "",
      sixMonth: "",
      lastMonth: "",
    },
  ]);

  const handleRegister = async () => {
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
        occupation: stepData[2].occupation,
        study: stepData[2].study,
        dni1: stepData[3].files[0],
        dni2: stepData[3].files[1],
      };
      let result = await registerRequest(register_user);
      updateErrorAtIndex(5, !result);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * The getStepperStage function is a helper function that determines which component to render based
   * on the current step of the stepper.
   */

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
            occupation={stepData[2].occupation}
            study={stepData[2].study}
            phone={stepData[2].phone}
            email={stepData[2].email}
            registerState={true}
            ref={dataRef}
          />
        );
      case 3:
        return <FormFileAttach ref={dataRef} files={stepData[3].files} />;

      case 4:
        return (
          <FormDatePlan first={true} ref={dataRef} email={stepData[2].email} />
        );

      case 5:
        return !errors[5] ? (
          <FormMessageSuccess first={true} />
        ) : (
          <FormMessageError padding={8} />
        );
    }
  };

  const handleBack = () => {
    let active = activeStep;
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    updateErrorAtIndex(active, false);
  };

  const updateErrorAtIndex = (index, value) => {
    setErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = value;
      return newErrors;
    });
  };

  const updateStepData = (receivedData) => {
    setStepData((prevStepData) => {
      const newStepData = [...prevStepData];
      newStepData[activeStep] = { ...receivedData };
      return newStepData;
    });
  };

  const handleNext = async () => {
    let error = false;
    if (dataRef.current && typeof dataRef.current.handleErrors === "function") {
      error = dataRef.current.handleErrors();
    }
    updateErrorAtIndex(activeStep, error);
    if (!error) {
      /* This code block is handling the data received from the current step of the form. */
      if (activeStep <= 4) {
        updateStepData(dataRef.current.getData());
        if (activeStep === 4) {
          setLock(true)
          await handleRegister();
        }
      }
      setActiveStep((prevstep) => prevstep + 1);
      setLock(false)
    }
  };

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
      <Suspense fallback={<Skeleton width={300} height={200} />}>
        <Box sx={{padding:2}}>
        {StepperStage(activeStep)}
        </Box>
      </Suspense>

      <CardContent>
        <Stepper
          ref={stepperRef}
          activeStep={activeStep}
          alternativeLabel
          sx={centeringStyles}
        >
          {!errors[5] &&
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
              ? errors[5]
                ? handleRegister
                : handleLogin
              : handleNext
          }
          disabled={lock}
        >
          {itLastState()
            ? errors[5]
              ? commonButtons.restart
              : commonButtons.login
            : itLastState(4)
            ? commonButtons.ok
            : commonButtons.next}
        </Button>
      </CardActions>
    </Card>
  );
};

export default AuthRegister;
