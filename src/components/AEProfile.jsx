import { Typography } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import React, { lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EmailVerifyProvider } from "../contexts/EmailVerifyContext";
import { useService } from "../contexts/ServiceContext";
import { useComponentAEProfileString } from "../contexts/TextProvider.jsx";
import AlertFragment from "../fragments/AlertFragmet.jsx";
import Calendar from "../fragments/profile/Calendar.jsx";
import CustomChip from "../fragments/profile/PofileCustomChip.jsx";
import ProfileInfo from "../fragments/profile/ProfileInfo.jsx";
import { centeringStyles } from "../theme.jsx";
import { isSameMonth } from "../utiles.js";

const Grid = lazy(() => import("@mui/material/Grid"));
const Paper = lazy(() => import("@mui/material/Paper"));
const Stack = lazy(() => import("@mui/material/Stack"));

/**
 * @brief Componente que muestra el perfil del AE.
 */
const AEProfile = () => {
  // Variables con los textos
  const labels = useComponentAEProfileString();
  // Servicios de backend
  const { User, serverDates, AE } = useService();

  const navigate = useNavigate();

  // Si no estoy loageado entonces voy a la raiz.
  useEffect(() => {
    if (!User) {
      navigate("/");
    }
  }, [User, navigate, serverDates]);

  return (
    <div>
      {User ? (
        <Grid
          container
          spacing={1}
          padding={User.ae !== AE.NON_AE ? 0 : 8}
          sx={centeringStyles}
        >
          <Grid item>
            <Stack spacing={2} sx={centeringStyles}>
              <EmailVerifyProvider>
                <ProfileInfo />
              </EmailVerifyProvider>

              {User.ae === AE.FINALIZED && (
                <AlertFragment
                  type={"warning"}
                  title={labels.calendar.alert_warning_finalize_onprocess.title}
                  body={labels.calendar.alert_warning_finalize_onprocess.body}
                />
              )}
            </Stack>
          </Grid>

          <Grid item>
            {User.ae !== AE.NON_AE ? (
              <Paper>
                <Stack
                  paddingTop={2}
                  paddingBlock={2}
                  spacing={3}
                  sx={{
                    width: "77vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid
                    item
                    sx={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Typography variant="h4">
                      {labels.calendar.title}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        ...centeringStyles,
                        minWidth: "77vw",
                        paddingBottom: 4,
                        overflow: "auto",
                      }}
                    >
                      <Grid key={"0"} item>
                        <Calendar
                          key={"0-calendar"}
                          intStart={serverDates.startDay}
                          intEnd={serverDates.startDay}
                          msg={labels.calendar.tooltip[0]}
                        />
                      </Grid>

                      {serverDates.hasOwnProperty("fifthMonth") && (
                        <Grid key={"1"} item>
                          <Calendar
                            key={"1-calendar"}
                            intStart={serverDates.fifthMonth}
                            intEnd={serverDates.sixthMonth}
                            msg={labels.calendar.tooltip[1]}
                          />
                        </Grid>
                      )}

                      {serverDates.hasOwnProperty("fifthMonth") &&
                        !isSameMonth(
                          serverDates.fifthMonth,
                          serverDates.sixthMonth
                        ) && (
                          <Grid key={"2"} item>
                            <Calendar
                              key={"2-calendar"}
                              intStart={serverDates.sixthMonth}
                              intEnd={serverDates.fifthMonth}
                              msg={labels.calendar.tooltip[1]}
                            />
                          </Grid>
                        )}

                      <Grid key={"3"} item>
                        <Calendar
                          key={"3-calendar"}
                          intStart={serverDates.lastMonth}
                          intEnd={serverDates.lastMonth}
                          msg={labels.calendar.tooltip[2]}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item sx={centeringStyles}>
                    <Stack direction={"row"} spacing={2}>
                      <CustomChip
                        paddingTop={3}
                        text={labels.calendar.chip[0]}
                        color={blue[200]}
                      />
                      {serverDates.hasOwnProperty("fifthMonth") && (
                        <CustomChip
                          text={labels.calendar.chip[1]}
                          color={red[200]}
                        />
                      )}
                    </Stack>
                  </Grid>
                </Stack>
              </Paper>
            ) : (
              <AlertFragment
                type={"warning"}
                title={labels.calendar.alert_warning_finish.title}
                body={labels.calendar.alert_warning_finish.body}
              />
            )}
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AEProfile;
