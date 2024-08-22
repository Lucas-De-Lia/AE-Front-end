import {
  Box,
  Button,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  Input,
  Stack,
  TextField,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import React, { useImperativeHandle, useState } from "react";
import {
  //useCommonsButtonString,
  useFormExtraString,
  useFormFileAttachString,
} from "../../contexts/TextProvider.jsx";
import { centeringStyles } from "../../theme.jsx";
import {
  doEmail,
  emailConocido,
  handleCopyCut,
  handlePaste,
} from "../../utiles.js";
import AlertFragment from "../AlertFragmet.jsx";
import { blue } from "@mui/material/colors";
import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

/**
 * @brief Step del formulario de registro, encargado de los datos extra y las imagenes del documento.
 */
const FormExtra = React.forwardRef(
  ({ phone, email, registerState, files }, ref) => {
    // Variables de texto
    const formextralabels = useFormExtraString();
    const formfileattachlabels = useFormFileAttachString();
    //const commonbuttonlabels = useCommonsButtonString();
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
    const [isButtonDisabled, setButtonDisabled] = useState(files.length > 0);

    // Estructura que gestiona los errores.
    const [errors, setErrors] = useState({
      phone: false,
      email: false,
      file: files.length < 0,
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
    const handleFileChange = (files) => {
      let file = files[0];
      if (file.type && file.type.startsWith("image/")) {
        setErrors({
          ...errors,
          files: false,
        });
        setUserData({ ...userData, files: [file] });
        setButtonDisabled(true);
      } else {
        setErrors({
          ...errors,
          files: true,
        });
      }
    };

    const handleRemoveFile = (index) => {
      setUserData({ userData, files: [] });
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
        file: files.length === 0,
      };
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

    const [highlight, setHighlight] = useState(false);

    const handleDragEnter = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (userData.files !== null) {
        setHighlight(true);
      }
    };
    const handleDragLeave = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setHighlight(false);
    };
    const handleDrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setHighlight(false);
      // Manejar los archivos aquí
      handleFileChange(event.dataTransfer.files);
    };

    return (
      <CardContent>
        <Grid container sx={centeringStyles} spacing={2}>
          {registerState && (
            <>
              <Grid item>
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
              <Grid item>
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
          <Grid item>
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
          sx={{ ...centeringStyles }}
          spacing={2}
          direction={{ xs: "column", sm: "column" }}
        >
          <Grid item>
            <FormControl
              sx={{
                border: "2px dashed #ccc",
                borderRadius: "8px",
                margin: "15px auto",
                padding: "20px",
                ...(highlight && { borderColor: "primary.main" }),
              }}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Stack spacing={2} sx={centeringStyles}>
                <AlertFragment
                  type={
                    errors.files_size || errors.files_type
                      ? "error"
                      : userData.files.length === 2
                      ? "success"
                      : "info"
                  }
                  title={formfileattachlabels.title}
                  body={formfileattachlabels.body}
                />
                <Input
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  sx={{ display: "none" }}
                  id="file-upload"
                  onChange={(e) => {
                    handleFileChange(e.target.files);
                  }}
                  error={errors.files_size || errors.files_type}
                  disabled={isButtonDisabled}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    disabled={isButtonDisabled}
                    sx={{
                      backgroundColor: "info.main",
                      "&:hover": {
                        backgroundColor: blue[800],
                      },
                      borderRadius: "8px",
                      padding: "8px 8px",
                      //fontFamily: "sans-serif",
                    }}
                    startIcon={<CloudUploadIcon />}
                  >
                    Subir Imagen
                  </Button>
                </label>
                {userData.files.length > 0 && (
                  <Box sx={centeringStyles}>
                    {userData.files.map((file, index) => (
                      <Box
                        sx={{
                          width: "100%",
                          height: "40vh",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          overflow: "hidden",
                          margin: "10px auto",
                          padding: "-1px",
                          position: "relative",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFile(index)}
                          sx={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            backgroundColor: "#ccc",
                          }}
                          aria-label="delete"
                        >
                          <ClearIcon />
                        </IconButton>
                        <Box
                          component="img"
                          sx={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "inherit",
                            objectFit: "fill",
                          }}
                          src={URL.createObjectURL(file)}
                          alt={`file-${index}`}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Stack>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    );
  }
);

export default FormExtra;
