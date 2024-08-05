import {
  Alert,
  AlertTitle,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  NativeSelect,
  TextField,
} from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useImperativeHandle, useState } from "react";
import {
  useComponentPasswordAlertString,
  useFormInfoString,
} from "../../contexts/TextProvider.jsx";
import { centeringStyles } from "../../theme.jsx";
import { datecontrol, doformatCUIL, testpassword } from "../../utiles.js";

const genders = [
  { label: "Ninguno", id: "-1" },
  { label: "Masculino", id: "M" },
  { label: "Femenino", id: "F" },
  { label: "X", id: "X" },
];
/**
 * @brief Step del registro, encargado de obtener la información principal , ocmo nombre , cuild y password
 */
const FormInfo = React.forwardRef((props, ref) => {
  // Variables texto
  const forminfolabels = useFormInfoString();
  const passwordalertlabels =
    useComponentPasswordAlertString().info.requirements;

  // Variables de estado
  const [userData, setUserData] = useState({
    name: props.name,
    lastname: props.lastname,
    cuil: props.cuil,
    birthdate: props.birthdate,
    gender: props.gender,
    password: props.password,
    passrep: props.password,
  });

  const [errors, setErrors] = useState({
    name: false,
    lastname: false,
    cuil: false,
    birthdate: false,
    gender: false,
    password: false,
    passrep: false,
  });

  // Estructura que almacena los formatters , que se encargan de decir que formato tiene cada textfield.
  const FieldsFormatters = {
    name: (value) => handleNothing(value),
    lastname: (value) => handleNothing(value),
    cuil: (value) => doformatCUIL(value),
    birthdate: (value) => handleNothing(value),
    gender: (value) => handleNothing(value),
    password: (value) => handleNothing(value),
    passrep: (value) => handleNothing(value),
  };
  // Estructura que almacena un conjunto de funciones que verifican si el campo contiene errores.
  const FieldsDetectedError = {
    name: (value) => handleEmptyness(value),
    lastname: (value) => handleEmptyness(value),
    cuil: (value) => handleEmptyness(value) || value.length !== 13,
    birthdate: (value) => handleDateControl(value) || handleEmptyness(value),
    gender: (value) => handleNonDefaultGender(value),
    password: (value) => handleEmptyness(value),
    passrep: (value) => handleRepPassword(value),
  };

  const handleNothing = (value) => value;
  const handleEmptyness = (value) => value === "";
  const handleDateControl = (value) => !datecontrol(new Date(value));
  const handleNonDefaultGender = (value) => value === -1;
  const handleRepPassword = (value) => !testpassword(value, userData.password);

  /**
   * @brief Funcion que gestiona los textfields.
   */
  const handleChange = (field, value) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: FieldsFormatters[field](value),
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: FieldsDetectedError[field](value),
    }));
  };

  const handleErrors = () => {
    let e = [
      "name",
      "lastname",
      "cuil",
      "password",
      "passrep",
      "birthdate",
      "gender",
    ].reduce((acc, field) => {
      acc[field] = FieldsDetectedError[field](userData[field]);
      return acc;
    }, {});
    setErrors(e);
    return Object.values(e).some(Boolean);
  };

  const getData = () => {
    return userData;
  };

  useImperativeHandle(ref, () => ({
    handleErrors,
    getData,
  }));

  return (
    <CardContent key={"Form-info"}>
      <Grid
        container
        sx={centeringStyles}
        spacing={{ xs: 1, sm: 2 }}
        direction={"column"}
      >
        <Grid item>
          <Grid container sx={centeringStyles} spacing={{ xs: 1, sm: 2 }}>
            {["name", "lastname", "cuil"].map((field) => (
              <Grid item key={field + "grid-item"}>
                <TextField 
                  required
                  size="small"
                  variant="standard"
                  id={field}
                  key={field}
                  label={forminfolabels[field]}
                  value={userData[field]}
                  error={errors[field]}
                  helperText={forminfolabels.helper_text[field]}
                  onChange={(event) => handleChange(field, event.target.value)}
                  InputLabelProps={{
                    shrink: userData[field] !== "",
                  }}
                />
              </Grid>
            ))}
            <Grid item xs={6} sm={3}>
              <TextField
                id="dates"
                key="dates"
                label={forminfolabels["birthdate"]}
                required
                value={userData["birthdate"]}
                error={errors["birthdate"]}
                type="date" // el formato esta dado por el idioma del browser
                size="small"
                helperText={forminfolabels.helper_text["birthdate"]}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(event) =>
                  handleChange("birthdate", event.target.value)
                }
                variant="standard"
              />
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel
                  sx={{ color: errors.gender ? red[600] : "inherit" }}
                  variant="standard"
                  key="gender-label"
                  htmlFor="gender"
                >
                  {forminfolabels.gender}
                </InputLabel>
                <NativeSelect
                  key="gender"
                  value={userData["gender"]}
                  onChange={(event) =>
                    handleChange("gender", event.target.value)
                  }
                  error={errors["gender"]}
                  size="small"
                  inputProps={{
                    name: "gender",
                    id: "gender-select",
                  }}
                >
                  {genders.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </NativeSelect>
                <FormHelperText>
                  {forminfolabels.helper_text["gender"]}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid item key={"grid-item-passwords"}>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {["password", "passrep"].map((field) => (
              <Grid item key={field + "grid-item"}>
                <TextField
                  required
                  size="small"
                  variant="standard"
                  id={field}
                  key={field}
                  type={"password"}
                  label={forminfolabels[field]}
                  value={userData[field]}
                  error={errors[field]}
                  helperText={forminfolabels.helper_text["password"]}
                  onChange={(event) => handleChange(field, event.target.value)}
                  InputLabelProps={{
                    shrink: userData[field] !== "",
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Alert
            severity={
              errors.password || errors.passrep
                ? "error"
                : userData.password.length > 0 && userData.passrep.length > 0
                ? "success"
                : "warning"
            }
            style={{ textAlign: "left", marginTop: "16px" }}
          >
            <AlertTitle>{passwordalertlabels.title}</AlertTitle>
            <ul>
              {passwordalertlabels.body.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </Alert>
        </Grid>
      </Grid>
    </CardContent>
  );
});

export default FormInfo;
