import { Link, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmailVerify } from "../../contexts/EmailVerifyContext.js";
import { useService } from "../../contexts/ServiceContext.js";
import {
  useCommonsFieldString,
  useComponentAEProfileString,
} from "../../contexts/TextProvider.jsx";
import { centeringStyles, gridProfileInfoStyle } from "../../theme.jsx";
import { sleep } from "../../utiles.js";
import EmailBackdrop from "../EmailBackdrop.jsx";
import SixtysecFragment from "../SixtysecFragment.jsx";
import IconUserBadge from "./ProfileIconUserBadge.jsx";

/**
 * @brief Componente que contiene el nombre y el menu del usuario para gestionar su cuenta
 */
const ProfileInfo = () => {
  // Variables de texto
  const aeprofilestring = useComponentAEProfileString();
  const commonfields = useCommonsFieldString();

  const nav = useNavigate();
  // Servicios del backend;
  const { AE, User, fetch_end_pdf, fetch_start_pdf } = useService();
  const { resend_verify_email } = useEmailVerify();
  // Variable de estado
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * @brief Abre una ventana con el certificado de finalización de AE
   */
  const handleEndPDF = async () => {
    try {
      const pdfUrl = await fetch_end_pdf();
      await window.open("data:application/pdf;base64," + pdfUrl, "_blank");
    } catch (error) {
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      console.error("Error al abrir el PDF:", error);
    }
  };
  /**
   * @brief Abre una ventana con el certificado de AE
   */
  const handleStartPDF = async () => {
    try {
      const pdfUrl = await fetch_start_pdf();
      await window.open("data:application/pdf;base64," + pdfUrl, "_blank");
    } catch (error) {
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      console.error("Error al abrir el PDF:", error);
    }
  };
  const handleGoTo = (url) => {
    nav(url);
  };
  /**
   * @brief Reenvia el email de verificación.
   */
  const sendEmail = async () => {
    setOpen(true);
    setLoading(true);
    await resend_verify_email();
    setLoading(false);
    await sleep(500);
    setOpen(false);
    return true;
  };

  return (
    <Box
      sx={{
        ...centeringStyles,
        paddingLeft: "4px",
        paddingRight: "4px",
      }}
    >
      <Paper elevation={1} sx={gridProfileInfoStyle}>
        <Stack sx={centeringStyles}>
          <IconUserBadge
            username={User.name}
            isActive={User.ae !== AE.NON_AE}
          />
          <Typography variant="body1" paddingRight={17} fontSize={10}>
            {commonfields.cuil}
          </Typography>
          <Typography variant="h5">{User.cuil}</Typography>
          <Typography variant="body1">{User.name}</Typography>
        </Stack>
        <Stack padding={2} spacing={1} sx={centeringStyles}>
          {User.ae === AE.FINALIZED && (
            <Link size="small" onClick={handleEndPDF}>
              {aeprofilestring.link_label.end_of_ae_certificate}
            </Link>
          )}
          {User.ae !== AE.NON_AE && User.ae !== AE.FINALIZED && (
            <Link size="small" onClick={handleStartPDF}>
              {aeprofilestring.link_label.start_of_ae_certificate}
            </Link>
          )}
          <Link size="small" onClick={(e) => handleGoTo("/password/change")}>
            {aeprofilestring.link_label.password_change}
          </Link>
          {User.email_verified_at ? (
            <Link size="small" onClick={(e) => handleGoTo("/email/change")}>
              {aeprofilestring.link_label.email_change}
            </Link>
          ) : (
            <SixtysecFragment
              action={sendEmail}
              label={aeprofilestring.link_label.email_verify}
            >
              <Link />
            </SixtysecFragment>
          )}
        </Stack>
      </Paper>
      <EmailBackdrop open={open} loading={loading} />
    </Box>
  );
};

export default ProfileInfo;
