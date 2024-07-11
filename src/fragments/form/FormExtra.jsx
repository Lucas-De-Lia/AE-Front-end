import {
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  NativeSelect,
  TextField,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import React, { useImperativeHandle, useState } from "react";
import { useFormExtraString } from "../../contexts/TextProvider.jsx";
import { centeringStyles } from "../../theme.jsx";
import { doEmail, emailConocido } from "../../utiles.js";

const FormExtra = React.forwardRef(
  ({ occupation, study, phone, email, registerState }, ref) => {
    const formextralabels = useFormExtraString();

    const [userData, setUserData] = useState({
      occupation,
      study,
      phone,
      email,
    });
    const [emailCopy, setEmailCopy] = useState([]);

    const [errors, setErrors] = useState({
      phone: false,
      email: false,
    });

    const handleChange = (value, field, formatter) => {
      setUserData((prevUserData) => ({
        ...prevUserData,
        [field]: formatter(value),
      }));
    };

    const Fields = {
      occupation: [
        { label: "Empleado", id: "E" },
        { label: "Profesional Independiente", id: "PI" },
        { label: "Autonomo", id: "A" },
        { label: "Estudiante", id: "ES" },
        { label: "Jubilado", id: "J" },
        { label: "Desocupado", id: "D" },
        { label: "Otro", id: "O" },
        { label: "No Contesta", id: "NC" },
      ],
      study: [
        { label: "Primaria", id: "P" },
        { label: "Secundaria", id: "S" },
        { label: "Tercearia", id: "T" },
        { label: "Universitaria", id: "U" },
        { label: "Otra", id: "O" },
        { label: "No contesta", id: "NC" },
      ],
    };
    const handlePaste = (event) => {
      event.preventDefault(); // Evita la acción de pegado
      // Aquí podrías mostrar un mensaje al usuario o simplemente no hacer nada
    };

    const handleCopyCut = (event) => {
      event.preventDefault(); // Evita la acción de copiado o cortado
      // Aquí podrías mostrar un mensaje al usuario o simplemente no hacer nada
    };
    const handleErrors = () => {
      const { phone, email } = userData;
      const errors = {
        phone: false,
        email:
          !email.trim() ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          !emailConocido(email) ||
          emailCopy !== email,
      };

      setErrors(errors);

      return Object.values(errors).some(Boolean);
    };

    const handleChangeNotFormatter = (event, field) => {
      const value = event.target.value;
      setUserData((prevData) => ({ ...prevData, [field]: value }));
    };

    const getData = () => {
      return userData;
    };

    useImperativeHandle(ref, () => ({
      handleErrors,
      getData,
    }));

    const FieldFormatter = {
      phone: (value) => value,
      email: (value) => doEmail(value),
    };

    return (
      <CardContent>
        <Grid container sx={centeringStyles} padding={3} spacing={3}>
          {["occupation", "study"].map((field) => (
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel htmlFor={field}>
                  {formextralabels[field]}
                </InputLabel>
                <NativeSelect
                  value={userData[field]}
                  size="small"
                  onChange={(event) => handleChangeNotFormatter(event, field)}
                  inputProps={{
                    name: field,
                    id: field,
                  }}
                >
                  {Fields[field].map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Grid>
          ))}
          <Grid item xs={12} sm={5}>
            <MuiTelInput
              sx={{ pt: 3 }}
              id="area-code"
              size="small"
              variant="standard"
              defaultCountry={"AR"}
              value={userData["phone"]}
              onChange={(event) =>
                handleChange(event, "phone", FieldFormatter["phone"])
              }
              label={formextralabels["phone"]}
              error={errors["phone"]}
              helperText={"Sin el 15"}
            />
          </Grid>

          {registerState && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField
                  id={"email"}
                  label={formextralabels["email"]}
                  disabled={false}
                  required
                  error={errors["email"]}
                  size="small"
                  onPaste={handlePaste}
                  onCopy={handleCopyCut}
                  onCut={handleCopyCut}
                  value={userData["email"]}
                  onChange={(event) =>
                    handleChange(
                      event.target.value,
                      "email",
                      FieldFormatter["email"]
                    )
                  }
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  id={"emailCopy"}
                  label={formextralabels["email"] + " Repetir"}
                  disabled={false}
                  required
                  onPaste={handlePaste}
                  onCopy={handleCopyCut}
                  onCut={handleCopyCut}
                  error={errors["email"]}
                  size="small"
                  value={emailCopy}
                  onChange={(event) => setEmailCopy(event.target.value)}
                  variant="standard"
                />
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    );
  }
);

export default FormExtra;
