import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useCommonsButtonString,
  useComponentAECreateString,
  useComponentAuthRegisterString,
} from "../contexts/TextProvider.jsx";

import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useService } from "../contexts/ServiceContext.js";
import { cardRegisterStyle, centerButtonsStyle } from "../theme.jsx";
import { formatDate } from "../utiles.js";

import AlertFragment from "../fragments/AlertFragmet.jsx";
import FormAddress from "../fragments/form/FormAddress.jsx";
import FormExtra from "../fragments/form/FormExtra.jsx";
import FormMessageError from "../fragments/form/FormMessageError.jsx";
import FormMessageSuccess from "../fragments/form/FormMessageSuccess.jsx";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";

import { ExpandMore, HowToReg } from "@mui/icons-material";
import { usePublicResources } from "../contexts/PublicResourcesContext.js";

const sx = {
  border: `1px solid #999999`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
};
const sx_summ = { background: "rgba(0, 0, 0, .03)" };

const sx_de = {
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  alignItems: "justify",
  justifyContent: "justify",
  textAlign: "justify",
};
/**
 * @brief El el comoponente encargado de la renovacion o creacion de una AE ,para un usuario ya registrado.
 */
export const AECreate = () => {
  // Variables que tienen los textos
  const buttonlabels = useCommonsButtonString();
  const aecreatelabels = useComponentAECreateString();
  const onlytitles = useComponentAuthRegisterString().step_title;

  // Variables de estado
  // Muestra el formulario de creacion o el mensaje de exito/error
  const [open, setOpen] = useState(false);
  // Si open es verdadero y loading tambine muestra un icono de carga
  const [loading, setLoading] = useState(true);

  // Controla el mensaje de exito/error deacuerdo al resultado del envio de los datos.
  const [errorSend, setSendError] = useState(false);

  const [stepData, setStepData] = useState(null);

  // Referencia al formulario visible por el expanded
  const refs = useRef(null);

  // Servicios de comunicacion conel backend (un conjunto de funciones y constantes utiles)
  const { User, fetch_user_data, start_ae_n, refesh_fn } = useService();
  const {
    get_province_names,
    get_citys_name,
    get_substate_names,
    get_address_names,
  } = usePublicResources();

  const navigate = useNavigate();

  /**
   * @brief Hace un fetch a la API de geoloc para obtener la lista de provincias/etc y cargarlas en los selects.
   */
  const getLocate = useCallback(
    async (response) => {
      let city_substate = response.city.split(" , ");
      const [state, substate, city, address] = await Promise.all([
        get_province_names(response.state),
        get_substate_names(response.state, city_substate[0]),
        get_citys_name(response.state, city_substate[0], city_substate[1]),
        get_address_names(
          response.state,
          city_substate[0],
          city_substate[1],
          response.address
        ),
      ]);
      return {
        state: state[0],
        substate: substate[0],
        city: city[0],
        address: address[0],
      };
    },
    [get_province_names, get_citys_name, get_substate_names, get_address_names]
  );

  /**
   * @brief Recibe la informacion del usuario y crea una estructura de datos para el formulario
   * */
  const makeUser = (info, locinfo) => {
    return [
      {
        name: info.name,
        lastname: info.lastname,
        cuil: info.cuil,
        birthdate: info.birthdate,
        gender: info.gender,
      },
      {
        state: locinfo.state, //las funciones devuelven listas pero de 1 solo elemento
        substate: locinfo.substate, // sollo al ser busquedas exactas
        city: locinfo.city,
        address: locinfo.address,
        floor: info.floor,
        number: info.nro_address,
        apartment: info.apartment,
        postalCode: info.postalCode,
      },
      {
        phone: info.phone,
        email: info.email,
        files: [], // se quito lo de las files de la renovacion
      },
    ];
  };

  /**
   * @brief Funcion encargada de utilizar las funciones anteriores para cargar la información en el formulario
   * */
  const updateValues = useCallback(async () => {
    try {
      const response = await fetch_user_data();
      const locate = await getLocate(response);
      let aux = makeUser(response, locate);
      setStepData(aux);
    } catch (error) {
      console.error(error);
    }
  }, [fetch_user_data, getLocate]);

  useEffect(() => {
    //visualiza una vez cargado todo
    if (stepData) {
      setLoading(false);
    }
  }, [stepData]);

  // si no estas logeado te redirigira al origen
  useEffect(() => {
    if (User === null) {
      navigate("/");
    }
    updateValues();
  }, [User, navigate, setStepData, fetch_user_data, updateValues]);

  /**
   * @brief Funcion encargada armar la estructura de informacion para el envio y lo realiza.
   */
  const handleRegister = async () => {
    try {
      let register_user = {
        firstname: stepData[0].name,
        lastname: stepData[0].lastname,
        birthdate: formatDate(new Date(stepData[0].birthdate)),
        gender: stepData[0].gender,
        address: stepData[1].address.nombre,
        address_number: stepData[1].number,
        floor: stepData[1].floor,
        apartment: stepData[1].apartment,
        postalcode: stepData[1].postalCode,
        city:`${stepData[1].substate.nombre} , ${stepData[1].city.nombre}`,
        state: stepData[1].state.nombre,
        phone: stepData[2].phone,
        startdate: formatDate(new Date()),
      };
      let result = await start_ae_n(register_user);
      console.log(result);
      setOpen(true);
      setSendError(!result);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * @brief Se encarga de verificar los errores en cada acordion y de llamar a la funcion de registro
   */
  const handleSend = async () => {
    setSendError(true);
    let elemento = refs.current;
    let error = await elemento.handleErrors()
    if (elemento !== null && !error) {
      await handleRegister();
    }
    setSendError(error);
  };

  /**
   * @brief Se encarga de cerrar y volver al perfil
   */
  const handleClose = () => {
    refesh_fn();
    navigate("/ae/profile");
  };

  /**
   * @brief Se encarga de cerrar y retoceder
   */
  const handleBack = () => {
    if (open) {
      setOpen(false);
    } else {
      navigate(-1);
    }
  };

  return (
    <Suspense
      fallback={
        <CardContent style={{ textAlign: "center" }}>
          <CircularProgress />
        </CardContent>
      }
    >
      <Card sx={cardRegisterStyle}>
        <CardHeader
          avatar={<HowToReg />}
          titleTypographyProps={{ variant: "h6" }}
          title={aecreatelabels.title}
        />
        <CardContent>
          {open ? (
            !errorSend ? (
              <FormMessageSuccess first={false} />
            ) : (
              <FormMessageError />
            )
          ) : loading ? (
            <>
              <CircularProgress />
            </>
          ) : (
            <>
              <AlertFragment
                type="info"
                title={aecreatelabels.alert_info.title}
                body={aecreatelabels.alert_info.body}
              />
              <FormAddress
                address={stepData[1].address}
                floor={stepData[1].floor}
                apartment={stepData[1].apartment}
                state={stepData[1].state}
                substate={stepData[1].substate}
                number={stepData[1].number}
                city={stepData[1].city}
                postalCode={stepData[1].postalCode}
                ref={refs}
              />
            </>
          )}
        </CardContent>

        <CardActions sx={centerButtonsStyle}>
          <Button size="small" color="inherit" onClick={handleBack}>
            {buttonlabels.cancel}
          </Button>
          <Button
            size="small"
            disabled={errorSend}
            onClick={
              (!errorSend && open) || (errorSend && !open)
                ? handleClose
                : handleSend
            }
          >
            {errorSend ? buttonlabels.restart : buttonlabels.ok}
          </Button>
        </CardActions>
      </Card>
    </Suspense>
  );
};

export default AECreate;
