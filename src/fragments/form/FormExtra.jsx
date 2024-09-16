import {
  Box,
  Button,
  CardContent,
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  Stack,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  //useCommonsButtonString,
  useFormExtraString,
  useFormFileAttachString,
} from "../../contexts/TextProvider.jsx";
import { centeringStyles, boxCapture } from "../../theme.jsx";
import {
  doEmail,
  emailConocido,
  handleCopyCut,
  handlePaste,
  sleep,
} from "../../utiles.js";
import AlertFragment from "../AlertFragmet.jsx";
import { blue } from "@mui/material/colors";
import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Webcam from "react-webcam";
import CameraIcon from "@mui/icons-material/Camera";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import WebcamCapture from "../WebCapture.jsx";

const StyledSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

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

    const [cameraOn, setCameraOn] = useState(false);
    const webcamRef = useRef(null);
    const [imageSrc, setImageSrc] = useState("");
    // Estructura que guarda el formato que debe tener un campo
    const FieldFormatter = {
      phone: (value) => value,
      email: (value) => doEmail(value),
    };
    const [emailCopy, setEmailCopy] = useState([]);

    //boton de carga de archivos una ves que se cargan las dos imagenes se desactiva
    const [isButtonDisabled, setButtonDisabled] = useState(imageSrc.length > 0);

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
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          setImageSrc(reader.result);
          console.log(reader.result);
          setErrors({
            ...errors,
            files: false,
          });
        };
        reader.onerror = (error) => {
          setErrors({
            ...errors,
            files: true,
          });
        };

        setButtonDisabled(true);
      } else {
        setErrors({
          ...errors,
          files: true,
        });
      }
    };

    const handleCameraChange = (e) => {
      setCameraOn(e.target.checked);
      setImageSrc("");
      setButtonDisabled(false);
    };
    const handleRemoveFile = () => {
      setImageSrc("");
      setButtonDisabled(false);
    };

    /**
     * @brief Funcion de gestion de errores.
     */
    const handleErrors = () => {
      const { phone, email } = userData;
      const errors_r = {
        ...errors,
        phone: !phone.trim(),
        email:
          !email.trim() ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          !emailConocido(email) ||
          emailCopy !== email,
        file: imageSrc.length === 0,
      };
      setErrors(errors_r);
      return Object.values(errors_r).some(Boolean);
    };

    const getData = () => {
      return { ...userData, files: imageSrc };
    };

    useImperativeHandle(ref, () => ({
      handleErrors,
      getData,
    }));

    const [highlight, setHighlight] = useState(false);

    const handleDragEnter = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (imageSrc !== "") {
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
                padding: "10px",
                ...(highlight && { borderColor: "primary.main" }),
              }}
              onDragEnter={cameraOn ? null : handleDragEnter}
              onDragOver={cameraOn ? null : handleDragEnter}
              onDragLeave={cameraOn ? null : handleDragLeave}
              onDrop={cameraOn ? null : handleDrop}
            >
              <Stack spacing={2} sx={centeringStyles}>
                <FormControlLabel
                  value="top"
                  disabled
                  sx={{ display: "none" }}
                  control={<StyledSwitch onChange={handleCameraChange} />}
                  label="Utilizar Camara"
                  labelPlacement="start"
                />
                <AlertFragment
                  type={
                    errors.files_size || errors.files_type
                      ? "error"
                      : imageSrc.length === 2
                      ? "success"
                      : "info"
                  }
                  title={formfileattachlabels.title}
                  body={formfileattachlabels.body}
                />
                {!cameraOn ? (
                  <>
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
                  </>
                ) : (
                  <WebcamCapture
                    ref={webcamRef}
                    imageSrc={imageSrc}
                    setImageSrc={setImageSrc}
                  />
                )}

                {imageSrc.length > 0 && (
                  <Box sx={centeringStyles}>
                    <Box
                      sx={{
                        ...boxCapture,
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        overflow: "hidden",
                        margin: "10px auto",
                        padding: "-1px",
                        position: "relative",
                      }}
                    >
                      <Typography
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 2,
                          left: 2,
                          paddingRight: 2,
                          paddingLeft: 2,
                          borderRadius: "8px",
                          backgroundColor: "rgba(240, 240, 240, 0.85)",
                        }}
                      >
                        {" Foto Subida: " +
                          new Date(Date.now()).toLocaleString() +
                          " "}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile()}
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          backgroundColor: "rgba(240, 240, 240, 0.85)",
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
                        src={`${imageSrc}`}
                        alt={`file`}
                      />
                    </Box>
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

/** */
