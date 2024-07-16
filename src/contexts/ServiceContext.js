// AuthContext.js
import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { dates_to_json_calendar, sleep } from "../utiles";

const URL_BACKEND = process.env.REACT_APP_BACK_URL;
const APP_KEY = process.env.REACT_APP_KEY;
const SITE_SECRET = process.env.REACT_APP_SECRET_KEY;

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
  const [User, setUser] = useState(null);
  const [Authorization, setAuthorizationState] = useState(null);
  const [serverDates, setServerDates] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(User !== null);

  const setEmailUndefined = () => {
    setUser({ ...User, email_verified_at: null });
  };
  
  /**
   * Function to set the authorization state and update the session storage accordingly
   * @param  {Object} newval - The new authorization state
   * @returns {void}
   * */
  const setAuthorization = (newval) => {
    setAuthorizationState(newval); // Set the authorization state
    if (newval === null) {
      localStorage.removeItem("authorization"); // Remove the "authorization" item from sessionStorage if newval is null
    } else {
      localStorage.setItem("authorization", JSON.stringify(newval)); // Store the newval in sessionStorage as a JSON string
    }
  };

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

  }
  /**
   * Authenticates the user with the provided username and password
   * @async
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @returns {Promise<boolean>} - True if the authentication is successful, false otherwise
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
   * Function to log out the user , and clear user data and authentication status
   * @async
   * @returns {Promise<boolean>} - Indicates if the logout was successful
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
   * Function to send a registration request to the backend
   * @async
   * @param {Object} register_user - The user object to be registered
   * @returns {Promise<boolean>} - True if the user is created successfully, false otherwise
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
   * Function to fetch user data asynchronously.
   *
   * @return {Promise<Object>} the response from the fetch
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
   * Function to start the AE process asynchronously
   * @async
   * @param {Object} register_user - The user data to be registered
   * @returns {Promise<boolean>} - True if the process is successfully started, false otherwise
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
   * This function finalizes the current Ae, using the given password for authentication.
   *
   * @param {string} password - the password to use for finalization
   * @return {boolean} true if the Ae is finalized successfully, false otherwise
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
   * Fetches a certificate of the end of the AE in format PDF.
   * @async
   * @returns {Promise<string>} The content of the end PDF on base64.
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
   * Fetches  a certificate of the start of the AE in format PDF.
   * @async
   * @return {Promise<string>} The content of the PDF on base64.
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

  /**
   * Refreshes the user's token and retrieves fresh user data
   * @async
   * @return {Promise<boolean>} true if the token refresh was successful, false otherwise
   */
  const refesh = useCallback(async () => {
    return await refesh_fn();
  }, []);

  const verifyCaptcha = async (tokenvalue) => {
    const response = await axios.post(
      `${URL_BACKEND}/api/captcha`,
      {
        token: tokenvalue,
      },
      {
        headers: { "X-API-Key": APP_KEY },
        withCredentials: true,
      });
    return response;
  }
  useEffect(() => {
    const parsedAuthorization = JSON.parse(
      localStorage.getItem("authorization") || "null"
    );
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

