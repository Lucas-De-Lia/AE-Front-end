// AuthContext.js
import axios from "axios";
import React, { createContext, useContext } from "react";
import { decryptData, encryptData } from "../utiles";
import { useService } from "./ServiceContext";

const URL_BACKEND = process.env.REACT_APP_BACK_URL;
const APP_KEY = process.env.REACT_APP_KEY;
const KEY_CRYPT = process.env.REACT_APP_CRYPT;

const EmailVerifyContext = createContext();

export const EmailVerifyProvider = ({ children }) => {
  const { Authorization } = useService();
  /**
   * @brief Reenvia el email de verificación , si el usuario todavía no ha verificado su correo.
   */
  const resend_verify_email = async () => {
    try {
      const { data } = await axios.post(
        `${URL_BACKEND}/api/email/notification`,
        {},
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { message } = decryptData(data.data, KEY_CRYPT);
      return message !== null;
    } catch (error) {
      let msg = decryptData(error.response.data.data, KEY_CRYPT);
      console.error("Error al reenviar el correo:", msg);
      return false;
    }
  };

  /**
   * @brief Envia el email de verificación, devuelve verdarosi el email esta verificado.
   */
  const send_confirmation_verify = async (id, hash, expires, signature) => {
    try {
      const { data } = await axios.post(
        `${URL_BACKEND}/api/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`,
        {},
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { message } = decryptData(data.data, KEY_CRYPT);
      console.log(message);
      return (
        message === "Email verified" || message === "Email already Verified"
      );
    } catch (error) {
      let msg = decryptData(error.response.data.data, KEY_CRYPT);
      console.error("Error during email verification:", msg);
      return false;
    }
  };

  /**
   * @brief Enviael codigo de verificacion a la direccion de correo electronico especificada.
   */
  const send_confirmation_code = async (code, email) => {
    try {
      // Send a POST request to the backend API to confirm the email verification
      const { data } = await axios.post(
        `${URL_BACKEND}/api/auth/email/verify/confirm`,
        {
          data: encryptData(
            {
              code: code,
              email: email,
            },
            KEY_CRYPT
          ),
        },
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { message } = decryptData(data.data, KEY_CRYPT);
      return message === "Confirmation successful";
    } catch (error) {
      let msg = decryptData(error.response.data.data, KEY_CRYPT);
      console.error("Error during email verification:", msg);
      return false;
    }
  };

  /**
   * @brief Envia el email de confirmacion.
   */
  const send_confirmation_email = async (password, email) => {
    try {
      // Send a post request to the backend API to send the confirmation email
      const { data } = await axios.post(
        `${URL_BACKEND}/api/email/change`,
        {
          data: encryptData(
            {
              current_password: password,
              email: email,
            },
            KEY_CRYPT
          ),
        },
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { message } = decryptData(data.data, KEY_CRYPT);
      return message === "Verification send successfully";
    } catch (error) {
      // Log and return false if there's an error during the confirmation process
      let msg = decryptData(error.response.data.data, KEY_CRYPT);
      console.error("Error during code verification: ", msg);
      throw new Error(error);
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
