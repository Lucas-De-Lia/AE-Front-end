import axios from "axios";

const URL_BACKEND = process.env.REACT_APP_BACK_URL;
const APP_KEY = process.env.REACT_APP_KEY;

export const useNewEmailVerify = () => {
  const sendVerification = async (token) => {
    try {
      const { data } = await axios.post(
        `${URL_BACKEND}/api/email/verifyNewEmail`,
        { token },
        { headers: { "X-API-KEY": APP_KEY } }
      );
      return data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || "Error verifying email."
      );
    }
  };

  return {
    sendVerification,
  };
};
