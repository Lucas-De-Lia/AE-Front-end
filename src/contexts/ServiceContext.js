// AuthContext.js
import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { dates_to_json_calendar, sleep, encryptData, decryptData } from "../utiles";

const URL_BACKEND = process.env.REACT_APP_BACK_URL;
const APP_KEY = process.env.REACT_APP_KEY;
const KEY_CRYPT = process.env.REACT_APP_CRYPT;

/**
 * Enum representing the status of AE
 */
const AE = {
  /** Not an AE */
  NON_AE: -1,
  /** Finalized */
  FINALIZED: 0,
  /** Finishable */
  FINISHABLE: 1,
  /** Non-finishable */
  NON_FINISHABLE: 2,
};
const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  //Variables de estasod
  const [User, setUser] = useState(null);
  const [Authorization, setAuthorizationState] = useState(null);
  const [serverDates, setServerDates] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(User !== null);

  /**
   * @brief Email verificar .
   */
  const setEmailUndefined = () => {
    setUser({ ...User, email_verified_at: null });
  };

  /**
   * @brief Almazena los datos de aothorization para axios
   * */
  const setAuthorization = (newval) => {
    setAuthorizationState(newval); // Set the authorization state
    if (newval === null) {
      localStorage.removeItem("authorization"); // Remove the "authorization" item from sessionStorage if newval is null
    } else {
      let encryptAuth = encryptData(JSON.stringify(newval), KEY_CRYPT); // encrypto los datos de logeo
      localStorage.setItem("authorization", encryptAuth); // Store the newval in sessionStorage as a JSON string
    }
  };
  /**
   * @brief Guarda los datos de Authorization y las setea en axios.
   */
  const saveAuth = (authorization) => {
    setAuthorization({
      ...authorization,
      timestamp: Date.now(),
    });

    // Set additional headers for the axios instance
    axios.defaults.headers.common = {
      ...axios.defaults.headers.common,
      "XSRF-TOKEN": authorization.X_CSRF_TOKEN,
      "User-Agent": "FRONT-END-REACT",
      "X-API-Key": APP_KEY,
      Authorization: authorization.type + authorization.token,
    };
  };

  /**
   * @brief Realiza la peticion de authentication al backend, setea los valores y retorna un booleano con el exito de la operacion.
   */
  const authenticate = async (username, password) => {
    try {
      // Send a POST request to the backend API to authenticate the user
      const response = await axios.post(
        `${URL_BACKEND}/api/auth/login`,
        {
          cuil: username,
          password: password,
        },
        {
          headers: { "X-API-Key": APP_KEY },
          withCredentials: true,
        }
      );
      let { authorization, user } = response.data;
      if (user && authorization) {
        // Save the authorization token for future requests
        saveAuth(authorization);

        try {
          // Get additional user data from the backend API
          const aeResponse = await axios.get(`${URL_BACKEND}/api/ae/dates`);
          const { type, dates } = aeResponse.data;
          user.ae = type;
          if (dates.startDay) {
            // Convert dates to calendar format and set it in the state
            const dates_calendar = dates_to_json_calendar(dates);
            setServerDates(dates_calendar);
          }
        } catch (error) {
          console.error("Error getting AE dates:", error);
        }
        // Set user authentication status and user data in the state
        setIsAuthenticated(true);
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  /**
   * @brief Envia una peticion para hacer un logout en el backend y limpia llas variables internas.
   */
  const unauthenticate = async () => {
    try {
      // Send a POST request to the logout endpoint
      const response = await axios.post(`${URL_BACKEND}/api/auth/logout`);
      const { message } = response.data;
      if (message === "Successfully logged out") {
        // Clear user data and authentication status
        setUser(null);
        setIsAuthenticated(false);
        setServerDates(null);
      }
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  };

  /**
   * @brief Envia los datos para el registro, devuelve un booleano con el exito de la operacion.
   */
  const registerRequest = async (register_user) => {
    try {
      // Send a POST request to the backend API to register the user
      const response = await axios.post(
        `${URL_BACKEND}/api/auth/register`,
        register_user,
        {
          headers: {
            "X-API-Key": APP_KEY,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { message, authorization } = response.data;
      saveAuth(authorization);
      return message === "User created successfully";
    } catch (error) {
      // Log and handle any errors that occur during the registration process
      console.error("Error during register:", error);
      return false;
    }
  };

  /**
   * @brief Envia una petición al backend para obtener la informacion del usuario.
   */
  const fetch_user_data = async () => {
    try {
      const response = await axios.get(
        `${URL_BACKEND}/api/ae/fetch-user-data`,
        {},
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { data } = response;
      return data;
    } catch (error) {
      console.error("Error al obtener el UserData:", error);
      return null;
    }
  };

  /**
   * @brief Envia la peticioón para la renovacion o crear una nueva exclusion para un usuario ya registrado.
   */
  const start_ae_n = async (register_user) => {
    try {
      // Send a POST request to start the AE process
      const response = await axios.post(
        `${URL_BACKEND}/api/ae/start-n`,
        register_user,
        { headers: { "X-API-Key": APP_KEY } }
      );
      const message = response.data;
      if (message === "Agregado") {
        // Reset server dates
        setServerDates(null);
        return true;
      }
      return false;
    } catch (error) {
      // Log and return false if an error occurs during the registration process
      console.error("Error during register:", error);
      return false;
    }
  };

  /**
   * @brief Envia una peticion para "dar de baja" una exclusion.
   */
  const finalize_ae = async (password) => {
    try {
      const response = await axios.post(
        `${URL_BACKEND}/api/ae/finalize`,
        {
          password: password,
        },
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { status } = response.data;
      return status === "Finalizado";
    } catch (error) {
      console.error("Error during register:", error);
      return false;
    }
  };

  /**
   * @brief Obtiene el ceritificado de fin de autoexclusion. en formato base64
   */
  const fetch_end_pdf = async () => {
    try {
      const response = await axios.get(
        `${URL_BACKEND}/api/ae/fetch-end-pdf`,
        {},
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { content } = response.data;
      return content;
    } catch (error) {
      console.error("Error al obtener el PDF:", error);
      return null;
    }
  };

  /**
   * @brief Obtiene el certificado de autoexcluido.
   */
  const fetch_start_pdf = async () => {
    try {
      const response = await axios.get(
        `${URL_BACKEND}/api/ae/fetch-start-pdf`,
        {},
        { headers: { "X-API-Key": APP_KEY } }
      );
      const { content } = response.data;
      return content;
    } catch (error) {
      console.error("Error al obtener el PDF:", error);
      return null;
    }
  };

  /**
   * @brief Gestiona mantener la cuenta cuando recarga la pagina
   */
  const refesh_fn = async () => {
    const responseRefresh = axios
      .post(
        `${URL_BACKEND}/api/auth/refresh`,
        {}, // No request body needed
        { headers: { "X-API-Key": APP_KEY } }
      )
      .catch((error) => {
        console.error("Error al refrescar:", error);
        return false;
      });
    const responseDates = axios
      .get(`${URL_BACKEND}/api/ae/dates`, {
        headers: { "X-API-Key": APP_KEY },
      })
      .catch((error) => {
        console.error("Error al refrescar:", error);
      });
    return await Promise.all([responseRefresh, responseDates]).then(
      (responses) => {
        if (responses[0]) {
          const { user } = responses[0].data;
          if (user) {
            if (responses[1]) {
              const { type, dates } = responses[1].data;
              user.ae = type;
              if (dates.startDay) {
                setServerDates(dates_to_json_calendar(dates));
              }
            }
            setUser(user);
            setIsAuthenticated(true);
          }
        }
        return false;
      }
    );
  };
  const refesh = useCallback(async () => {
    return await refesh_fn();
  }, []);

  /**
   * @brief Envia el token del Captcha para verificar su validez.
   */
  const verifyCaptcha = async (tokenvalue) => {
    const response = await axios.post(
      `${URL_BACKEND}/api/captcha`,
      {
        token: tokenvalue,
      },
      {
        headers: { "X-API-Key": APP_KEY },
        withCredentials: true,
      }
    );
    return response;
  };

  useEffect(() => {
    let parsedAuthorization = null;
    const encryptedAuth = localStorage.getItem("authorization");
    if (encryptedAuth) {
      try {
        const decryptedAuth = decryptData(encryptedAuth, KEY_CRYPT);
        parsedAuthorization = JSON.parse(decryptedAuth);
      } catch (error) {
        console.error("Error parsing or decrypting authorization data:", error);
        parsedAuthorization = JSON.parse(null);
      }
    }
    if (
      parsedAuthorization &&
      parsedAuthorization.timestamp >= Date.now() - 3600000
    ) {
      const { X_CSRF_TOKEN, type, token } = parsedAuthorization;
      axios.defaults.headers.common["XSRF-TOKEN"] = X_CSRF_TOKEN;
      axios.defaults.headers.common["Authorization"] = type + token;
      axios.defaults.headers.common["X-API-Key"] = APP_KEY;
      sleep(50);
      refesh();
    }
  }, [refesh]);

  return (
    <ServiceContext.Provider
      value={{
        refesh_fn,
        fetch_end_pdf,
        isAuthenticated,
        setIsAuthenticated,
        User,
        setUser,
        serverDates,
        setServerDates,
        setAuthorization,
        setEmailUndefined,
        Authorization,
        authenticate,
        unauthenticate,
        registerRequest,
        start_ae_n,
        AE,
        fetch_user_data,
        fetch_start_pdf,
        finalize_ae,
        verifyCaptcha,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  return useContext(ServiceContext);
};
