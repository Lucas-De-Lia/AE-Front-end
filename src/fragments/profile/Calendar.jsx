import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import { motion } from "framer-motion";
import React from "react";
import {
  dateBetween,
  dayGreaterEqual,
  dayLessEqual,
  isEnddate,
  isSameMonth,
  isStartdate,
  isToday,
  monthGreater,
} from "../../utiles";

/**
 * @brief Crea una lista de los dias de un mes
 */
const getDaysInMonth = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const startingDayOfWeek = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
  const daysInMonth = [];

  // Agrega celdas vacias deacuerdo al dia del mes.Es decir si empieza el mes un martes , agrega una
  // celda por el domingo , una por el lunes .
  for (let i = 0; i < startingDayOfWeek; i++) {
    daysInMonth.push(null);
  }

  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Agrego el resto de dias del mes
  for (let i = 1; i <= lastDay.getDate(); i++) {
    daysInMonth.push(i);
  }
  if (daysInMonth.length % 7 !== 0) {
    const remainingDays = 7 - (daysInMonth.length % 7);
    for (let i = 0; i < remainingDays; i++) {
      daysInMonth.push(null);
    }
  }
  return daysInMonth;
};

const chunkArray = (arr, size) => {
  const chunkedArray = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArray.push(arr.slice(i, i + size));
  }
  return chunkedArray;
};
/**
 * @brief Componente de calendario precente en el perfil de usuario, si la fecha del props son iguales grafica solo un punto
 * para el mes de baja se utiliza dos fechas diferentes, si start es mayor que end se toma como primer calendario
 * si end es mayor que start se toma como segundo calendario (en el caso de necesitar dos calendarios)
 */
const Calendar = ({ intStart, intEnd }) => {
  const currentDate = intStart;
  const daysInMonth = getDaysInMonth(currentDate);

  const monthName = new Intl.DateTimeFormat("es", { month: "long" }).format(
    currentDate
  );

  /**
   * @bief Genera una celda para un dia, y colorea segun sea neceario
   */
  const getTableCel = (day, rowIndex, cellIndex) => {
    const isSingleCalendar = intStart === intEnd;
    // Valores default
    let range_start = null;
    let range_end = null;
    let key = `${day}-${rowIndex}-${cellIndex}`;
    const radius = "7px";
    let color = grey[50];
    // Verifica si las fechas son iguales es decir es un calendario de fecha inicio o final
    if (isSingleCalendar) {
      if (isToday(day, intEnd)) {
        // Si la celda es la fecha de inicio , la coloreo
        color = blue[200];
      }
    } else {
      // Es un rango de fechas
      range_start = isStartdate(day, intStart, cellIndex);
      range_end = isEnddate(day, intEnd, cellIndex);
      if (isSameMonth(intStart, intEnd)) {
        // Es un solo mes
        if (dateBetween(intStart, day, intEnd)) {
          // si es una fecha dentro de este rango , lo coloreo
          color = red[200];
          // si es el inicio o el final redondeo los bordes
          range_start = range_start || isToday(day, intStart);
          range_end = range_end || isToday(day, intEnd);
        }
      } else {
        // es un rango pero cubre dos meses
        if (monthGreater(intStart, intEnd)) {
          if (dayGreaterEqual(day, intStart, cellIndex, rowIndex)) {
            color = red[200];
            //priemr mes
            range_start = range_start || isToday(day, intStart);
          }
        } else {
          if (dayLessEqual(day, intStart, cellIndex, rowIndex)) {
            color = red[200];
            //segundo mes
            range_end = range_end || isToday(day, intStart);
          }
        }
      }

      return (
        <TableCell
          key={key}
          size="small"
          sx={{
            padding: "5px",
            borderTopLeftRadius: range_start ? radius : 0,
            borderBottomLeftRadius: range_start ? radius : 0,
            borderTopRightRadius: range_end ? radius : 0,
            borderBottomRightRadius: range_end ? radius : 0,
            backgroundColor: color,
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
            {day === null ? "" : day.toString()}
          </Typography>
        </TableCell>
      );
    }

    return (
      <TableCell
        key={key}
        size="small"
        sx={{
          padding: "5px",
          borderRadius: radius,
          backgroundColor: color,
        }}
      >
        <Typography sx={{ textAlign: "center" }}>
          {day === null ? "" : day.toString()}
        </Typography>
      </TableCell>
    );
  };

  return (
    <motion.div
      className="box"
      whileHover={{ scale: 1.1 }}
      drag={false}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <Stack>
        <Typography gutterBottom variant="h7">
          {monthName.charAt(0).toUpperCase() +
            monthName.slice(1) +
            " " +
            currentDate.getFullYear()}
        </Typography>
        <TableContainer component={Paper} elevation={3}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                  (day, index) => (
                    <TableCell
                      sx={{
                        backgroundColor: "#d9d9d9",
                        textAlign: "center",
                        textJustify: "center",
                        padding: "5px",
                      }}
                      key={`${day}-${intStart}-${intEnd}`}
                    >
                      {day}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {chunkArray(daysInMonth, 7).map((row, rowIndex) => (
                <TableRow key={`${intStart}-${intEnd}-row-${row}-${rowIndex}`}>
                  {row.map((day, index) => getTableCel(day, rowIndex, index))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </motion.div>
  );
};

export default Calendar;
