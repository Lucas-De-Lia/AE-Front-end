import axios from "axios";
import React, { createContext, useContext } from "react";

const URL_BACKEND = process.env.REACT_APP_BACK_URL;
const APP_KEY = process.env.REACT_APP_KEY;

const PasswordServiceContext = createContext();

export const PasswordServiceProvider = ({ children }) => {
  /**
   * @brief Envia la solicitud para enviar los emails de reseteo de contraseña
   */
  const send_forgot_password_email = async (cuil) => {
    try {
      const response = await axios.post(
        `${URL_BACKEND}/api/password/forgot`,
        {
          cuil: cuil,
        },
        { headers: { "X-API-Key": APP_KEY } }
      );

      const { status } = response.data;

      return status === "We have emailed your password reset link.";
    } catch (error) {
      console.error("Error during password reset:", error);
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
      const response = await axios.post(
        `${URL_BACKEND}/api/password/reset`,
        {
          token: token,
          cuil: cuil,
          password: password,
          password_confirmation: password_confirmation,
        },
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { status } = response.data;
      return status === "Your password has been reset.";
    } catch (error) {
      console.error("Error during password reset:", error);
      return false;
    }
  };

  /**
   * @brief  Cambia la contraseña de un usuario, requiere la contraseña vieja
   */
  const change_user_password = async (data) => {
    try {
      const response = await axios.post(
        `${URL_BACKEND}/api/password/change`,
        data,
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { message } = response.data;
      return message === "Password changed successfully";
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
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
