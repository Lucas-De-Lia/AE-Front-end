import { Box, Button, CardContent, Grid, TextField } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import React, { useImperativeHandle, useState } from "react";
import {
  useCommonsButtonString,
  useFormExtraString,
  useFormFileAttachString,
} from "../../contexts/TextProvider.jsx";
import { centeringStyles } from "../../theme.jsx";
import {
  doEmail,
  emailConocido,
  handleCopyCut,
  handlePaste,
  shortFileName,
} from "../../utiles.js";
import AlertFragment from "../AlertFragmet.jsx";

/**
 * @brief Step del formulario de registro, encargado de los datos extra y las imagenes del documento.
 */
const FormExtra = React.forwardRef(
  ({ phone, email, registerState, files }, ref) => {
    // Variables de texto
    const formextralabels = useFormExtraString();
    const formfileattachlabels = useFormFileAttachString();
    const commonbuttonlabels = useCommonsButtonString();
    // Variables de datos.
    const [userData, setUserData] = useState({
      phone,
      email,
      files,
    });
    // Estructura que guarda el formato que debe tener un campo
    const FieldFormatter = {
      phone: (value) => value,
      email: (value) => doEmail(value),
    };
    const [emailCopy, setEmailCopy] = useState([]);

    //boton de carga de archivos una ves que se cargan las dos imagenes se desactiva
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    // Estructura que gestiona los errores.
    const [errors, setErrors] = useState({
      phone: false,
      email: false,
      files_size: false,
      files_type: false,
    });

    /**
     * @brief Función encargada de gestional los fieldtext agregandole un formato.
     */
    const handleChange = (value, field, formatter) => {
      setUserData((prevUserData) => ({
        ...prevUserData,
        [field]: formatter(value),
      }));
    };

    /**
     * @brief Funcion encagada de gestionar la suba de archivos
     *  */
    const handleFileChange = (event) => {
      let files = event.target.files;
      let selectedFilesArray = [];
      if (userData.files) {
        selectedFilesArray = userData.files;
      }

      // Limitar la cantidad de archivos a 2
      for (let i = 0; i < Math.min(files.length, 2); i++) {
        let file = files[i];
        if (file.type && file.type.startsWith("image/")) {
          selectedFilesArray.push(file);
          setErrors({
            ...errors,
            files_type: false,
          });
        } else {
          setErrors({
            ...errors,
            files_type: true,
          });
        }
      }

      setUserData({ ...userData, files: selectedFilesArray });
      setButtonDisabled(selectedFilesArray.length >= 2);
    };
    const handleRemoveFile = (index) => {
      const updatedFiles = userData.files;
      updatedFiles.splice(index, 1);
      setUserData({ userData, files: updatedFiles });
      setButtonDisabled(false);
    };

    /**
     * @brief Funcion de gestion de errores.
     */
    const handleErrors = () => {
      const { phone, email, files } = userData;
      const errors_r = {
        ...errors,
        phone: !phone.trim(),
        email:
          !email.trim() ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          !emailConocido(email) ||
          emailCopy !== email,
        files_size: files.length < 2,
        files_type: false,
      };
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          errors_r.files_type = true;
          break;
        }
      }
      setErrors(errors_r);
      return Object.values(errors_r).some(Boolean);
    };

    const getData = () => {
      return userData;
    };

    useImperativeHandle(ref, () => ({
      handleErrors,
      getData,
    }));

    return (
      <CardContent>
        <Grid container sx={centeringStyles} spacing={3}>
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
                  //onCopy={handleCopyCut}
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
                  //onCopy={handleCopyCut}
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
          <Grid item xs={12} sm={5}>
            <MuiTelInput
              sx={{ pt: 3 }}
              id="area-code"
              size="small"
              variant="standard"
              required
              onlyCountries={["AR"]}
              defaultCountry={"AR"}
              disableDropdown
              value={userData["phone"]}
              onChange={(event) =>
                handleChange(event, "phone", FieldFormatter["phone"])
              }
              label={formextralabels["phone"]}
              error={errors["phone"]}
              helperText={"Obligatorio y sin el 15"}
            />
          </Grid>
        </Grid>
        <Grid
          container
          sx={centeringStyles}
          spacing={2}
          direction={{ xs: "column", sm: "column" }}
        >
          <Grid item xs={12} md={6}>
            <Box>
              <AlertFragment
                type={
                  errors.files_size || errors.files_type
                    ? "error"
                    : userData.files.length == 2
                    ? "success"
                    : "info"
                }
                title={formfileattachlabels.title}
                body={formfileattachlabels.body}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <TextField
                fullWidth
                id="fileInput"
                label={formfileattachlabels.files_selected.title}
                type="file"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                accept="image/*"
                multiple
                size="small"
                error={errors.files_size || errors.files_type}
                disabled={isButtonDisabled}
                onChange={handleFileChange}
              />
              {userData.files.length > 0 && (
                <div>
                  <p>{formfileattachlabels.files_selected.list}</p>
                  <ul>
                    {userData.files.map((file, index) => (
                      <li key={index}>
                        {shortFileName(file.name)}
                        <Button onClick={() => handleRemoveFile(index)}>
                          {commonbuttonlabels.delete}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    );
  }
);

export default FormExtra;
