// AuthContext.js
import axios from "axios";
import React, { createContext, useContext } from "react";

const URL_BACKEND = process.env.REACT_APP_BACK_URL;
const APP_KEY = process.env.REACT_APP_KEY;

const EmailVerifyContext = createContext();

export const EmailVerifyProvider = ({ children }) => {
  /**
   * @brief Reenvia el email de verificación , si el usuario todavía no ha verificado su correo.
   */
  const resend_verify_email = async () => {
    try {
      const response = await axios.post(
        `${URL_BACKEND}/api/email/notification`,
        {},
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { message } = response.data;
      return message !== null;
    } catch (error) {
      console.error("Error al reenviar el correo:", error);
      return false;
    }
  };

  /**
   * @brief Envia el email de verificación, devuelve verdarosi el email esta verificado.
   */
  const send_confirmation_verify = async (id, hash, expires, signature) => {
    try {
      const response = await axios.post(
        `${URL_BACKEND}/api/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`,
        {},
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { message } = response.data;
      console.log(response);
      return (
        message === "Email verified" || message === "Email already verified"
      );
    } catch (error) {
      console.error("Error during email verification:", error);
      return false;
    }
  };

  /**
   * @brief Enviael codigo de verificacion a la direccion de correo electronico especificada.
   */
  const send_confirmation_code = async (code, email) => {
    try {
      // Send a POST request to the backend API to confirm the email verification
      const response = await axios.post(
        `${URL_BACKEND}/api/auth/email/verify/confirm`,
        {
          code: code,
          email: email,
        },
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { message } = response.data;
      if (message === "Confirmation successful") {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error during email verification:", error);
      return false;
    }
  };


  /**
   * @brief Envia el email de confirmacion.
   */
  const send_confirmation_email = async (password, email) => {
    try {
      // Send a post request to the backend API to send the confirmation email
      const result = await axios.post(
        `${URL_BACKEND}/api/email/change`,
        {
          current_password: password,
          email: email,
        },
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { message } = result.data;
      return message === "Verification send successfully";
    } catch (error) {
      // Log and return false if there's an error during the confirmation process
      console.error("Error during code verification: ", error);
      return false;
    }
  };

  return (
    <EmailVerifyContext.Provider
      value={{
        send_confirmation_email,
        send_confirmation_code,
        send_confirmation_verify,
        resend_verify_email,
      }}
    >
      {children}
    </EmailVerifyContext.Provider>
  );
};

export const useEmailVerify = () => {
  return useContext(EmailVerifyContext);
};
