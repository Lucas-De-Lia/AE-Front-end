import { Autocomplete, CardContent, Grid, TextField } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { usePublicResources } from "../../contexts/PublicResourcesContext.js";
import { useFormAddressString } from "../../contexts/TextProvider.jsx";
import { centeringStyles } from "../../theme.jsx";
import { doApartment, doFloor, doPostalCode, itsNumber } from "../../utiles.js";

/**
 * The `AddressDataCard` component is a form component that displays fields for entering address data such as street address, floor, apartment, province, city, and postal code.
 * @param {object} props - The component properties.
 * @param {string} props.address - The initial street address.
 * @param {string} props.floor - The initial floor.
 * @param {string} props.apartment - The initial apartment.
 * @param {string} props.province - The initial province.
 * @param {string} props.city - The initial city.
 * @param {string} props.postalCode - The initial postal code.
 * @returns {JSX.Element} - Returns the `AddressDataCard` component.
 */

const handleEqualToValue = (option, value) => option.id === value.id;

const handleOptionLabel = (option) => option.nombre;

const handleNothing = (value) => value;

const FormAddress = React.forwardRef((props, ref) => {
  const formaddresslables = useFormAddressString();
  const {
    get_province_names,
    get_citys_name,
    get_substate_names,
    get_address_names,
    DEFAULT,
  } = usePublicResources();

  const [suggestions, setSuggestions] = useState({
    state: null,
    substate: null,
    city: null,
    address: null,
  });

  const setDefaults = (value) => (value !== "Ninguno" ? value : DEFAULT);
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
  const [errors, setErrors] = useState({
    address: false,
    state: false,
    city: false,
    postalCode: false,
    substate: false,
    number: false,
  });

  const handleChange = useCallback(async (value, field, formatter) => {
    if (value === null) value = DEFAULT;
    if (FieldsActions.hasOwnProperty(field)) {
      await FieldsActions[field](value);
    } else {
      if (["number", "floor", "apartment", "postalCode"].includes(field)) {
        await FieldsActions["other"](value, field);
      }
    }
  });

  const getSuggestions = useCallback(
    async (field, value = "") => {
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
    },
    [
      Fields,
      get_province_names,
      get_substate_names,
      get_citys_name,
      get_address_names,
    ]
  );

  const handleErrors = useCallback(() => {
    const newErrors = {
      state: !Fields["state"][0].id,
      substate: !Fields["substate"][0].id,
      city: !Fields["city"][0].id,
      address: !Fields["address"][0].id,
      postalCode:
        Fields["postalCode"][0] === "" && Fields["postalCode"][0].length !== 4,
      number:
        Fields["number"][0] === "" ||
        !itsNumber(Fields["number"][0]) ||
        Fields["number"][0] >= 9999 ||
        Fields["number"][0] <= 0,
    };

    setErrors(newErrors);
    return Object.values(newErrors).some(Boolean);
  }, [Fields]);

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

  const startup = useCallback(async (props) => {
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
  }, []);

  useEffect(() => {
    if (props.substate !== "Ninguno") {
      startup(props);
    } else {
      getSuggestions("state");
    }
  }, [props, startup]);

  return (
    <CardContent>
      <Grid container sx={centeringStyles} spacing={3}>
        {["state", "substate", "city", "address"].map((field) => (
          <Grid key={`grid.${field}`} item xs={12} sm={4}>
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
          <Grid key={`grid.${field}`} item xs={12} sm={3}>
            <TextField
              id={field}
              key={field}
              label={formaddresslables[field]}
              size="small"
              required={["postalCode", "number"].includes(field)}
              helperText={["postalCode", "number"].includes(field) ? "Obligatorio": ""}
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
