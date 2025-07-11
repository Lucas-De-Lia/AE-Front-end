import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Checklist, CleaningServices } from "@mui/icons-material";
import { cardRegisterStyle } from "../theme";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { useEffect, useState } from "react";
import { useService } from "../contexts/ServiceContext";
import utiles, { sleep } from "../utiles";
import ProcessAlert from "../fragments/ProcessAlert";

const initialState = {
  frecuencia: "",
  asistencia: "",
  horas: "",
  maquinasTradicionales: false,
  ruletaElectronica: false,
  carteados: false,
  ruletaAmericana: false,
  dados: false,
  bingo: false,
  socioClubJugadores: "",
  conocePlataformasOnline: "",
  utilizaPlataformasOnline: "",
  problemasAutocontrol: "",
  deseaRecibirInfo: "",
};

export const EncuentaAE = () => {
  const navigate = useNavigate();
  const [sendError, setSendError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);

  const { User } = useService();
  const { sendSurvey } = utiles;

  const {
    onInputChange,
    onInputChangeForCheck,
    onInputChangeForRadio,
    changeFormState,
    frecuencia,
    asistencia,
    horas,
    maquinasTradicionales,
    ruletaElectronica,
    carteados,
    ruletaAmericana,
    dados,
    bingo,
    socioClubJugadores,
    conocePlataformasOnline,
    utilizaPlataformasOnline,
    problemasAutocontrol,
    deseaRecibirInfo,
    formState,
    validate,
    errors,
    setErrors,
  } = useForm(initialState, {});

  const checkRange = (horas) => {
    const number = +horas;
    if ((number < 1 || number > 24) && horas !== "") return false;
    return true;
  };

  const handleBack = () => {
    navigate("/ae/profile");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requiredFields = [
      "frecuencia",
      "asistencia",
      "horas",
      "socioClubJugadores",
      "conocePlataformasOnline",
      "utilizaPlataformasOnline",
      "problemasAutocontrol",
      "deseaRecibirInfo",
    ];
    const { isValid } = validate(requiredFields);

    if (!isValid) {
      // Se mostrarán los errores, no se envía el formulario
      return;
    }
    if (utilizaPlataformasOnline === "") {
      changeFormState("utilizaPlataformasOnline", false);
    }
    changeFormState("horas", +horas);
    setLoading(true);
    setOpen(true);
    try {
      const res = await sendSurvey(formState);
      if (res.mensaje !== "Registro creado con exito") {
        setLoading(false);
        setSuccess(false);
        setSendError(true);
        await sleep(2000);
        setOpen(false);
      }
      setLoading(false);
      setSuccess(true);
      await sleep(2000);
      setOpen(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      setSendError(true);
      await sleep(2000);
      setOpen(false);
    }
  };
  useEffect(() => {
    if (!conocePlataformasOnline) {
      changeFormState("utilizaPlataformasOnline", "");
    }
  }, [conocePlataformasOnline]);
  useEffect(() => {
    if (!User) {
      navigate("/");
    }
    setLoading(false);
    setOpen(false);
  }, []);

  return (
    <>
      {!open && (
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...cardRegisterStyle,
          }}
        >
          <Alert severity="info">
            La información suministrada en esta encuesta será utilizada
            únicamente con fines estadísticos. Garantizamos que todos los datos
            proporcionados serán tratados con estricta confidencialidad y no se
            asociarán con su identidad personal bajo ninguna circunstancia.
          </Alert>
          <Card sx={cardRegisterStyle}>
            <CardHeader
              avatar={<Checklist />}
              titleTypographyProps={{ variant: "h6" }}
              title="Encuesta AutoExclusión"
            ></CardHeader>
            <Divider />
            <CardContent
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
                width: "100%",
                boxSizing: "border-box",
                p: 0,
                mt: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 5,
                  flexWrap: "wrap",
                  width: "80%",
                }}
              >
                <FormControl error={Boolean(errors.frecuencia)}>
                  <FormLabel id="frecuancia-casino-buttons">
                    ¿Con que frecuencia asiste al Casino?
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="frecuancia-casino-buttons"
                    name="frecuencia"
                    value={frecuencia}
                    onChange={onInputChange}
                  >
                    <FormControlLabel
                      value="Diaria"
                      control={<Radio />}
                      label="Diaria"
                    />
                    <FormControlLabel
                      value="Semanal"
                      control={<Radio />}
                      label="Semanal"
                    />
                    <FormControlLabel
                      value="Mensual"
                      control={<Radio />}
                      label="Mensual"
                    />
                  </RadioGroup>
                  {errors.frecuencia && (
                    <FormHelperText>{errors.frecuencia}</FormHelperText>
                  )}
                </FormControl>
                <FormControl error={Boolean(errors.asistencia)}>
                  <FormLabel id="asistencia-casino-buttons">
                    ¿Cómo asiste al Casino?
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="asistencia-casino-buttons"
                    name="asistencia"
                    value={asistencia}
                    onChange={onInputChange}
                  >
                    <FormControlLabel
                      value="Solo"
                      label="Solo"
                      control={<Radio />}
                    />
                    <FormControlLabel
                      value="Acompaniado"
                      label="Acompañado"
                      control={<Radio />}
                    />
                  </RadioGroup>
                  {errors.asistencia && (
                    <FormHelperText>{errors.asistencia}</FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Box>
                <FormControl error={Boolean(errors.horas)}>
                  <FormLabel>¿Cuánto tiempo permanece jugando?</FormLabel>
                  <TextField
                    type="number"
                    name="horas"
                    value={horas}
                    onChange={(e) => {
                      const valid = checkRange(e.target.value);
                      if (!valid) return;
                      onInputChange(e);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">horas</InputAdornment>
                      ),
                    }}
                  />
                  {errors.horas && (
                    <FormHelperText>{errors.horas}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              <Divider sx={{ width: "100%", px: 0 }} />
              <Typography component="h2" variant="h6">
                ¿Qué tipo de Juego le atrae?
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 5,
                  flexWrap: "wrap",
                  width: "80%",
                }}
              >
                <FormGroup>
                  <FormLabel>Máquinas Tragamonedas</FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="maquinasTradicionales"
                        checked={maquinasTradicionales}
                        onChange={onInputChangeForCheck}
                      />
                    }
                    label="Máquinas Tradicionales"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="ruletaElectronica"
                        checked={ruletaElectronica}
                        onChange={onInputChangeForCheck}
                      />
                    }
                    label="Ruleta Electrónica"
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Mesas de Paño</FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="carteados"
                        checked={carteados}
                        onChange={onInputChangeForCheck}
                      />
                    }
                    label="Carteados"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="ruletaAmericana"
                        checked={ruletaAmericana}
                        onChange={onInputChangeForCheck}
                      />
                    }
                    label="Ruleta Americana"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="dados"
                        checked={dados}
                        onChange={onInputChangeForCheck}
                      />
                    }
                    label="Dados"
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Bingo</FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="bingo"
                        checked={bingo}
                        onChange={onInputChangeForCheck}
                      />
                    }
                    label="Otro"
                  />
                </FormGroup>
              </Box>
              <Divider sx={{ width: "100%", px: 0 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 5,
                  flexWrap: "wrap",
                  width: "80%",
                }}
              >
                <FormControl error={Boolean(errors.socioClubJugadores)}>
                  <FormLabel id="socio-club-jugadores">
                    ¿Es socio del Club de Jugadores?
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="socio-club-jugador"
                    name="socioClubJugadores"
                    value={socioClubJugadores}
                    onChange={onInputChangeForRadio}
                  >
                    <FormControlLabel
                      label="Si"
                      value="true"
                      control={<Radio />}
                    ></FormControlLabel>
                    <FormControlLabel
                      label="No"
                      value="false"
                      control={<Radio />}
                    ></FormControlLabel>
                  </RadioGroup>
                  {errors.socioClubJugadores && (
                    <FormHelperText>{errors.socioClubJugadores}</FormHelperText>
                  )}
                </FormControl>
                <FormControl error={Boolean(errors.conocePlataformasOnline)}>
                  <FormLabel id="conoce-plataformas-online">
                    ¿Conoce las plataformas de Juego Online?{" "}
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="conoce-plataformas-online"
                    name="conocePlataformasOnline"
                    value={conocePlataformasOnline}
                    onChange={onInputChangeForRadio}
                  >
                    <FormControlLabel
                      label="Si"
                      value="true"
                      control={<Radio />}
                    ></FormControlLabel>
                    <FormControlLabel
                      label="No"
                      value="false"
                      control={<Radio />}
                    ></FormControlLabel>
                  </RadioGroup>
                  {errors.conocePlataformasOnline && (
                    <FormHelperText>
                      {errors.conocePlataformasOnline}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 5,
                  flexWrap: "wrap",
                  width: "80%",
                }}
              >
                <FormControl
                  error={
                    Boolean(errors.utilizaPlataformasOnline) &&
                    conocePlataformasOnline
                  }
                >
                  <FormLabel id="utiliza-plataformas-online">
                    Si conoce las plataformas de Juego Online, ¿las utiliza?
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="utiliza-plataformas-online"
                    name="utilizaPlataformasOnline"
                    value={utilizaPlataformasOnline}
                    onChange={onInputChangeForRadio}
                  >
                    <FormControlLabel
                      label="Si"
                      value="true"
                      control={<Radio />}
                      disabled={!conocePlataformasOnline}
                    ></FormControlLabel>
                    <FormControlLabel
                      label="No"
                      value="false"
                      control={<Radio />}
                      disabled={!conocePlataformasOnline}
                    ></FormControlLabel>
                  </RadioGroup>
                  {errors.utilizaPlataformasOnline &&
                    conocePlataformasOnline && (
                      <FormHelperText>
                        {errors.utilizaPlataformasOnline}
                      </FormHelperText>
                    )}
                </FormControl>
                <FormControl error={Boolean(errors.problemasAutocontrol)}>
                  <FormLabel id="problemas-autocontrol">
                    ¿Considera que su decisión de autoexcluirse responde a
                    problemas de Autocontrol sobre el juego?
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="problemas-autocontrol"
                    name="problemasAutocontrol"
                    value={problemasAutocontrol}
                    onChange={onInputChangeForRadio}
                  >
                    <FormControlLabel
                      label="Si"
                      value="true"
                      control={<Radio />}
                    ></FormControlLabel>
                    <FormControlLabel
                      label="No"
                      value="false"
                      control={<Radio />}
                    ></FormControlLabel>
                  </RadioGroup>
                  {errors.problemasAutocontrol && (
                    <FormHelperText>
                      {errors.problemasAutocontrol}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl error={Boolean(errors.deseaRecibirInfo)}>
                  <FormLabel id="desea-recibir-info">
                    ¿Desea recibir información sobre Juego Responsable?
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="desea-recibir-info"
                    name="deseaRecibirInfo"
                    value={deseaRecibirInfo}
                    onChange={onInputChangeForRadio}
                  >
                    <FormControlLabel
                      label="Si"
                      value="true"
                      control={<Radio />}
                    ></FormControlLabel>
                    <FormControlLabel
                      label="No"
                      value="false"
                      control={<Radio />}
                    ></FormControlLabel>
                  </RadioGroup>
                  {errors.deseaRecibirInfo && (
                    <FormHelperText>{errors.deseaRecibirInfo}</FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 5,
                  flexWrap: "wrap",
                  width: "80%",
                }}
              >
                <Button variant="contained" onClick={handleBack}>
                  Volver
                </Button>
                <Button variant="contained" type="submit">
                  Enviar
                </Button>
              </Box>
            </CardContent>
          </Card>
          {sendError && (
            <Alert severity="error">
              <strong>¡Algo salió mal!</strong>
              <br></br>
              No pudimos procesar tu respuesta. Puede que los datos sean
              inválidos o haya ocurrido un error en nuestros servidores. Por
              favor, intenta nuevamente más tarde.
            </Alert>
          )}
        </Stack>
      )}
      <ProcessAlert open={open} loading={loading} success={success} />
    </>
  );
};
