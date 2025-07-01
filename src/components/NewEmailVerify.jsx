import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useService } from "../contexts/ServiceContext";
import { useEffect, useState } from "react";
import { useNewEmailVerify } from "../hooks/useNewEmailVerify";
import { sleep } from "../utiles";
import {
  Backdrop,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AlertFragment from "../fragments/AlertFragmet";
import { useComponentEmailVerifyString } from "../contexts/TextProvider";

export const NewEmailVerify = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const { isAuthenticated } = useService();
  const emailverifylabels = useComponentEmailVerifyString();

  const { sendVerification } = useNewEmailVerify();

  // Control de estado para mensajes de error y de carga
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const verifyEmail = async () => {
    try {
      const data = await sendVerification(token);
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
    } finally {
      setLoading(false);
      await sleep(2000);
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      verifyEmail();
    }
  }, [isAuthenticated]);

  return (
    <>
      <Backdrop open={true}>
        {loading ? (
          <Paper>
            <Stack
              padding={4}
              spacing={5}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CircularProgress />
              <Typography variant="body1">
                {emailverifylabels.loading}
              </Typography>
            </Stack>
          </Paper>
        ) : success && !loading ? (
          <AlertFragment
            type={"success"}
            title={emailverifylabels.title}
            body={emailverifylabels.alert.success.body}
            strong={emailverifylabels.alert.success.strong}
          />
        ) : (
          <AlertFragment
            type={"error"}
            title={emailverifylabels.title}
            body={emailverifylabels.alert.fail.body}
            strong={emailverifylabels.alert.fail.strong}
          />
        )}
      </Backdrop>
    </>
  );
};
