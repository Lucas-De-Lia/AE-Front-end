import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Checklist } from "@mui/icons-material";
import { cardRegisterStyle } from "../theme";

export const EncuentaAE = () => {
  return (
    <Card sx={cardRegisterStyle}>
      <CardHeader
        avatar={<Checklist />}
        titleTypographyProps={{ variant: "h6" }}
        title="Encuesta AutoExclusión"
      ></CardHeader>
      <Divider />
      <CardContent
        component="form"
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
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              ¿Con que frecuencia asiste al Casino?
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
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
          </FormControl>
          <FormControl>
            <FormLabel id="radio-buttons-asistencia">
              ¿Cómo asiste al Casino?
            </FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-asistencia"
              name="rradio-buttons-asistencia"
            >
              <FormControlLabel value="Solo" label="Solo" control={<Radio />} />
              <FormControlLabel
                value="Acompañado"
                label="Acompañado"
                control={<Radio />}
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>¿Cuánto tiempo permanece jugando?</FormLabel>
            <TextField
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">horas</InputAdornment>
                ),
              }}
            />
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
              control={<Checkbox />}
              label="Máquinas Tradicionales"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Ruleta Electrónica"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Mesas de Paño</FormLabel>
            <FormControlLabel control={<Checkbox />} label="Carteados" />
            <FormControlLabel control={<Checkbox />} label="Ruleta Americana" />
            <FormControlLabel control={<Checkbox />} label="Dados" />
          </FormGroup>
          <FormGroup>
            <FormLabel>Bingo</FormLabel>
            <FormControlLabel control={<Checkbox />} label="Otro" />
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
          <FormGroup>
            <FormLabel>¿Es socio del Club de Jugadores?</FormLabel>
            <FormControlLabel
              label="Si"
              control={<Checkbox />}
            ></FormControlLabel>
            <FormControlLabel
              label="No"
              control={<Checkbox />}
            ></FormControlLabel>
          </FormGroup>
          <FormGroup>
            <FormLabel>¿Conoce las plataformas de Juego Online? </FormLabel>
            <FormControlLabel
              label="Si"
              control={<Checkbox />}
            ></FormControlLabel>
            <FormControlLabel
              label="No"
              control={<Checkbox />}
            ></FormControlLabel>
          </FormGroup>
          <FormGroup></FormGroup>
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
          <FormGroup>
            <FormLabel>
              Si conoce las plataformas de Juego Online, ¿las utiliza?
            </FormLabel>
            <FormControlLabel
              label="Si"
              control={<Checkbox />}
            ></FormControlLabel>
            <FormControlLabel
              label="No"
              control={<Checkbox />}
            ></FormControlLabel>
          </FormGroup>
          <FormGroup>
            <FormLabel>
              ¿Considera que su decisión de autoexcluirse responde a problemas
              de Autocontrol sobre el juego?{" "}
            </FormLabel>
            <FormControlLabel
              label="Si"
              control={<Checkbox />}
            ></FormControlLabel>
            <FormControlLabel
              label="No"
              control={<Checkbox />}
            ></FormControlLabel>
          </FormGroup>
          <FormGroup></FormGroup>
        </Box>
      </CardContent>
    </Card>
  );
};
