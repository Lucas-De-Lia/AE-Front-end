import {
  Backdrop,
  CircularProgress,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { default as React, useState } from "react";
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

import CheckIcon from "@mui/icons-material/Check";

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

  const [openPDF, setOpenPDF] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(true);

  const handleDownload = async (pdfBase64) => {
    const byteCharacters = atob(pdfBase64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  /**
   * @brief Abre una ventana con el certificado de AE
   */
  const handlePDF = async (fetch) => {
    let value = true;
    setOpenPDF(true);
    setLoadingPDF(true);
    try {
      const pdfBlob = await fetch();
      if (!pdfBlob) throw new Error("PDF no recibido");
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      value = false;
    } finally {
      setLoadingPDF(false);
      setOpenPDF(false);
    }
    return value;
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
      <Backdrop
        open={openPDF}
        sx={{
          zIndex: (theme) =>
            Math.max.apply(Math, Object.values(theme.zIndex)) + 1,
        }}
      >
        <Paper>
          <Box padding={4}>
            {/*animacion de enviado*/}
            {loadingPDF ? (
              <CircularProgress />
            ) : (
              <Stack sx={centeringStyles}>
                <CheckIcon fontSize="large" color="success" />
                <Typography> Constancia Descargado </Typography>
              </Stack>
            )}
          </Box>
        </Paper>
      </Backdrop>
      <Paper elevation={1} sx={gridProfileInfoStyle}>
        <Stack sx={centeringStyles}>
          <IconUserBadge
            username={User.name}
            isActive={User.ae !== AE.NON_AE}
          />
          <Typography variant="body1" paddingRight={17} fontSize={10}>
            {commonfields.dni}
          </Typography>
          <Typography variant="h5">{User.dni}</Typography>
          <Typography variant="body1">{User.name}</Typography>
        </Stack>
        <Stack padding={2} spacing={1} sx={centeringStyles}>
          {/* //TODO ARREGLAR LA DESCARGA DE PDFS  User.ae === AE.FINALIZED && */}
          {true && (
            <SixtysecFragment
              id={1}
              action={() => handlePDF(fetch_end_pdf)}
              label={aeprofilestring.link_label.end_of_ae_certificate}
            >
              <Link />
            </SixtysecFragment>
          )}
          {User.ae !== AE.NON_AE && User.ae !== AE.FINALIZED && (
            <SixtysecFragment
              id={2}
              action={() => handlePDF(fetch_start_pdf)}
              label={aeprofilestring.link_label.start_of_ae_certificate}
            >
              <Link />
            </SixtysecFragment>
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
              id={3}
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
