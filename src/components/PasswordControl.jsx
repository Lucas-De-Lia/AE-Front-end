import { Alert, AlertTitle } from "@mui/material";
import { useComponentPasswordAlertString } from "../contexts/TextProvider";

export const PasswordControl = ({
  errors = true,
  password = "",
  passrep = "",
}) => {
  const passwordalertlabels =
    useComponentPasswordAlertString().info.requirements;
  return (
    <Alert
      severity={
        errors
          ? "error"
          : password.length > 0 && passrep.length > 0
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
  );
};
