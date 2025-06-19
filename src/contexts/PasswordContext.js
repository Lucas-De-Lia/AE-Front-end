import axios from "axios";
import React, { createContext, useContext } from "react";
import { encryptData, decryptData } from "../utiles";

const URL_BACKEND = process.env.REACT_APP_BACK_URL;
const APP_KEY = process.env.REACT_APP_KEY;
const KEY_CRYPT = process.env.REACT_APP_CRYPT;

const PasswordServiceContext = createContext();

export const PasswordServiceProvider = ({ children }) => {
  /**
   * @brief Envia la solicitud para enviar los emails de reseteo de contraseña
   */
  const send_forgot_password_email = async (cuil) => {
    try {
      const { data } = await axios.post(
        `${URL_BACKEND}/api/password/forgot`,
        {
          data: encryptData({ cuil: cuil }, KEY_CRYPT),
        },
        { headers: { "X-API-Key": APP_KEY } }
      );

      const { status } = decryptData(data.data, KEY_CRYPT);

      return status === "We have emailed your password reset link.";
    } catch (error) {
      let msg = decryptData(error.response.data.data, KEY_CRYPT);
      console.error("Error during password reset:", msg);
      return false;
    }
  };

  /**
   * @brief Envia la solicitud para cambiar la contraseña
   */
  const send_reset_password = async (
    token,
    cuil,
    password,
    password_confirmation
  ) => {
    try {
      const { data } = await axios.post(
        `${URL_BACKEND}/api/password/reset`,
        {
          data: encryptData(
            {
              token: token,
              cuil: cuil,
              password: password,
              password_confirmation: password_confirmation,
            },
            KEY_CRYPT
          ),
        },
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { status } = decryptData(data.data, KEY_CRYPT);
      return status === "Your password has been reset.";
    } catch (error) {
      let msg = decryptData(error.response.data.data, KEY_CRYPT);
      console.error("Error during password reset:", msg);
      throw new Error(msg);
    }
  };

  /**
   * @brief  Cambia la contraseña de un usuario, requiere la contraseña vieja
   */
  const change_user_password = async (infoUser) => {
    try {
      const { data } = await axios.post(
        `${URL_BACKEND}/api/password/change`,
        { data: encryptData(infoUser, KEY_CRYPT) },
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { message } = decryptData(data.data, KEY_CRYPT);
      return message === "Password changed successfully";
    } catch (error) {
      let msg = decryptData(error.response.data.data, KEY_CRYPT);
      console.error("Error al cambiar la contraseña:", msg);
      return false;
    }
  };
  return (
    <PasswordServiceContext.Provider
      value={{
        send_forgot_password_email,
        change_user_password,
        send_reset_password,
      }}
    >
      {children}
    </PasswordServiceContext.Provider>
  );
};

export const usePasswordService = () => {
  return useContext(PasswordServiceContext);
};
