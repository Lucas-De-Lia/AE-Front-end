import { Autocomplete, CardContent, Grid, TextField } from "@mui/material";
import React, { useEffect, useImperativeHandle, useState } from "react";
import { usePublicResources } from "../../contexts/PublicResourcesContext.js";
import { useFormAddressString } from "../../contexts/TextProvider.jsx";
import { centeringStyles } from "../../theme.jsx";
import { doApartment, doFloor, doPostalCode, itsNumber } from "../../utiles.js";

const handleEqualToValue = (option, value) => option.id === value.id;

const handleOptionLabel = (option) => option.nombre;

const handleNothing = (value) => value;

/**
 * @brief  Step del formulario de registro que contiene el apartado de la dirección del autoexcluido
 */
const FormAddress = React.forwardRef((props, ref) => {
  //Variables de texto
  const formaddresslables = useFormAddressString();

  //Servicios del backend
  const {
    get_province_names,
    get_citys_name,
    get_substate_names,
    get_address_names,
    test_postal_code,
    DEFAULT,
  } = usePublicResources();

  // Sugerencias de procincias , ciudades y etc.
  const [suggestions, setSuggestions] = useState({
    state: null,
    substate: null,
    city: null,
    address: null,
  });

  const setDefaults = (value) => (value !== "Ninguno" ? value : DEFAULT);

  // Estructura que almacena los stados de cada campo.
  const Fields = {
    state: useState(setDefaults(props.state)),
    substate: useState(setDefaults(props.substate)),
    city: useState(setDefaults(props.city)),
    address: useState(setDefaults(props.address)),
    floor: useState(props.floor),
    apartment: useState(props.apartment),
    number: useState(props.number),
    postalCode: useState(props.postalCode),
  };
  // Estructura que almacena los formattters , que se encargan de modificar o agregar formato a los textfield
  const Formatters = {
    state: (value) => handleNothing(value),
    substate: (value) => handleNothing(value),
    city: (value) => handleNothing(value),
    address: (value) => handleNothing(value),
    number: (value) => doPostalCode(value),
    floor: (value) => doFloor(value),
    apartment: (value) => doApartment(value),
    postalCode: (value) => doPostalCode(value),
  };
  // Estructura que almacena las acciones, que hacer cuando se selecciona un campo.
  const FieldsActions = {
    state: async (value) => {
      Fields["state"][1](value);
      await getSuggestions("substate", value.nombre);
      Fields["substate"][1](DEFAULT);
      Fields["city"][1](DEFAULT);
      Fields["address"][1](DEFAULT);
    },
    substate: async (value) => {
      Fields["substate"][1](value);
      await getSuggestions("city", value.nombre);
      Fields["city"][1](DEFAULT);
      Fields["address"][1](DEFAULT);
    },
    city: async (value) => {
      Fields["city"][1](value);
      await getSuggestions("address", value.nombre);
      Fields["address"][1](DEFAULT);
    },
    address: async (value) => {
      Fields["address"][1](value);
    },
    other: (value, field) => {
      let formatedvalue = Formatters[field](value);
      Fields[field][1](formatedvalue);
    },
  };
  // Alamacena los errores que pueden suceder en el formulario
  const [errors, setErrors] = useState({
    address: false,
    state: false,
    city: false,
    postalCode: false,
    substate: false,
    number: false,
  });

  /**
   * @brief Gestiona los cambios de los estados en la estructura "Fields" aplicando un formato de ser necesario "Formatters" y ejecutando una acción "FieldsActions".
   */
  const handleChange = async (value, field, formatter) => {
    if (value === null) value = DEFAULT;
    if (FieldsActions.hasOwnProperty(field)) {
      await FieldsActions[field](value);
    } else {
      if (["number", "floor", "apartment", "postalCode"].includes(field)) {
        await FieldsActions["other"](value, field);
      }
    }
  };

  /**
   * @brief Funcion que se encarga de obtener las sugerencias para los campos .
   */
  const getSuggestions = async (field, value = "") => {
    let fields = [];
    switch (field) {
      default:
        throw new Error("Wrong field");
      case "state":
        fields = await get_province_names();
        break;
      case "substate":
        fields = await get_substate_names(value);
        break;
      case "city":
        fields = await get_citys_name(Fields["state"][1].nombre, value);
        break;
      case "address":
        fields = await get_address_names(
          Fields["state"][1].nombre,
          Fields["substate"][1].nombre,
          value
        );
        break;
    }

    setSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [field]: fields,
    }));
    return fields;
  };

  /**
   * @brief Verifica si existen errores en los campos obligatorios / o que tengan alguna restricción. y devuelve un booleano
   */
  const handleErrors = async () => {
    let postal = parseInt(Fields["postalCode"]);
    let booleanPostal = await test_postal_code(
      Fields["state"][0].nombre,
      Fields["city"][0].nombre,
      postal
    );
    const newErrors = {
      state: !Fields["state"][0].id,
      substate: !Fields["substate"][0].id,
      city: !Fields["city"][0].id,
      address: !Fields["address"][0].id,
      postalCode: Fields["postalCode"][0] === "" || booleanPostal, // rangos segun https://zippopotam.us/
      number:
        Fields["number"][0] === "" ||
        !itsNumber(Fields["number"][0]) ||
        Fields["number"][0] >= 9999 ||
        Fields["number"][0] <= 0,
    };
    setErrors(newErrors);
    return Object.values(newErrors).some(Boolean);
  };

  const getData = () => {
    return {
      state: Fields["state"][0],
      substate: Fields["substate"][0],
      city: Fields["city"][0],
      address: Fields["address"][0],
      floor: Fields["floor"][0],
      number: Fields["number"][0],
      apartment: Fields["apartment"][0],
      postalCode: Fields["postalCode"][0],
    };
  };

  useImperativeHandle(ref, () => ({
    handleErrors,
    getData,
  }));

  /**
   * @brief Gestiona el inicio, esto es para poder cargar una dirección cuando viene por props , por ejemplo cuando nav por el formulario
   * o carga los datos de un usuario ya autoexcluido para renovar.
   */
  const startup = async (props) => {
    let states = await get_province_names();
    let substates = await get_substate_names(props.state.nombre);
    let citys = await get_citys_name(props.state.nombre, props.substate.nombre);
    let address = await get_address_names(
      props.state.nombre,
      props.substate.nombre,
      props.city.nombre
    );
    setSuggestions({
      state: states,
      city: citys,
      address: address,
      substate: substates,
    });
  };

  useEffect(() => {
    if (props.substate !== "Ninguno") {
      startup(props);
    } else {
      getSuggestions("state");
    }
  }, [props, startup]);

  return (
    <CardContent>
      <Grid container sx={centeringStyles} spacing={2}>
        {["state", "substate", "city", "address"].map((field) => (
          <Grid key={`grid.${field}`} item xs={6} sm={3}>
            <Autocomplete
              autoHighlight
              id={field}
              key={field}
              size="small"
              onChange={(event, newvalue) => {
                handleChange(newvalue, field, Formatters[field]);
              }}
              disabled={!suggestions[field] || suggestions[field].length === 0}
              options={suggestions[field] || []}
              value={Fields[field][0]}
              isOptionEqualToValue={handleEqualToValue}
              getOptionKey={(value) => value.id}
              getOptionLabel={handleOptionLabel}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  required
                  error={errors[field]}
                  helperText={"Obligatorio"}
                  {...params}
                  label={formaddresslables[field]}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
          </Grid>
        ))}
        {["number", "floor", "apartment", "postalCode"].map((field) => (
          <Grid key={`grid.${field}`} item xs={6} sm={3}>
            <TextField
              id={field}
              key={field}
              label={formaddresslables[field]}
              size="small"
              required={["postalCode", "number"].includes(field)}
              helperText={
                ["postalCode", "number"].includes(field)
                  ? formaddresslables.helper_text["required"]
                  : formaddresslables.helper_text[field]
              }
              error={errors[field]}
              onChange={(event) =>
                handleChange(
                  event.target.value,
                  field,
                  Formatters[field](event.target.value)
                )
              }
              variant="standard"
              value={Fields[field][0]}
              InputLabelProps={{
                shrink: Boolean(Fields[field][0] !== ""),
              }}
            />
          </Grid>
        ))}
      </Grid>
    </CardContent>
  );
});

FormAddress.defaultProps = {
  address: "",
  substate: "",
  floor: "",
  apartment: "",
  number: "",
  province: "",
  city: "",
  postalCode: "",
};

export default FormAddress;
