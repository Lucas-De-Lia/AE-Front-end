import axios from "axios";
import React, { createContext, useContext } from "react";
import { decryptData } from "../utiles";

const URL_BACKEND = process.env.REACT_APP_BACK_URL;
const URL_GEOREF = process.env.REACT_APP_GEOREF_URL;
const URL_POSTAL = process.env.REACT_APP_POSTAL_URL;
const APP_KEY = process.env.REACT_APP_KEY;
const KEY_CRYPT = process.env.REACT_APP_CRYPT;

const PublicResourseContext = createContext();
const DEFAULT = { id: 0, nombre: "Ninguno" };

export const PublicResourcesProvider = ({ children }) => {
  /**
   * @brief Obtiene los nombres de las provincias
   */
  const get_province_names = async (province) => {
    try {
      let params = {
        campos: "basico",
        aplanar: true,
        orden: "nombre",
        exacto: false,
        max: 5000,
      };
      if (province) {
        params.nombre = province;
        params.max = 1;
        params.exacto = true;
      }
      const response = await axios.get(`${URL_GEOREF}/provincias`, {
        params,
      });
      let { cantidad, provincias } = response.data;
      provincias.push(DEFAULT);
      return cantidad > 0 ? provincias : [];
    } catch (error) {
      console.error("Error al obtener las provincias:", error);
      return [];
    }
  };

  /**
   * @brief Obtiene los nombres de las departamentos
   */
  const get_substate_names = async (province, department) => {
    try {
      let params = {
        campos: "basico",
        aplanar: true,
        provincia: province,
        orden: "nombre",
        exacto: false,
        max: 5000,
      };
      if (department) {
        params.nombre = department;
        params.max = 1;
        params.exacto = true;
      }
      const response = await axios.get(`${URL_GEOREF}/departamentos`, {
        params,
      });
      let { cantidad, departamentos } = response.data;
      departamentos.push(DEFAULT);
      return cantidad > 0 ? departamentos : [];
    } catch (error) {
      console.error("Error al obtener las provincias:", error);
      return [];
    }
  };

  /**
   * @brief Obtiene los nombres de las ciudad
   */
  const get_citys_name = async (province, department, city) => {
    try {
      let params = {
        campos: "basico",
        aplanar: true,
        provincia: province,
        departamento: department,
        orden: "nombre",
        exacto: false,
        max: 5000,
      };
      if (city) {
        params.nombre = city;
        params.max = 1;
        params.exacto = true;
      }
      const response = await axios.get(`${URL_GEOREF}/localidades-censales`, {
        params,
      });
      let { cantidad, localidades_censales } = response.data;
      localidades_censales.push(DEFAULT);
      return cantidad > 0 ? localidades_censales : [];
    } catch (error) {
      console.error("Error al obtener las localidades:", error);
      return [];
    }
  };

  /**
   * @brief Obtiene los nombres de las direcciónes
   */
  const get_address_names = async (province, department, locality, calle) => {
    try {
      let params = {
        campos: "basico",
        aplanar: true,
        provincia: province,
        departamento: department,
        localidad_censal: locality,
        orden: "nombre",
        exacto: false,
        max: 5000,
      };
      if (calle) {
        params.nombre = calle;
        params.max = 1;
        params.exacto = true;
      }
      const response = await axios.get(`${URL_GEOREF}/calles`, {
        params,
      });
      let { cantidad, calles } = response.data;
      calles.push(DEFAULT);
      return cantidad > 0 ? calles : [];
    } catch (error) {
      console.error("Error al obtener las direcciones:", error);
      return [];
    }
  };

  /**
   * @brief Obtiene si el codigo postal pertenece a la provincia y ciudad
   * devuelve true si existe error y false si no existe error
   */
  const test_postal_code = (postal_code) =>
    postal_code < 1000 || postal_code > 9999;

  function quitarAcentos(string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /**
   * @brief Obtiene la lista de noticias
   */
  const fetch_news_list = async (current_page, page_size) => {
    try {
      const { data } = await axios.post(
        `${URL_BACKEND}/api/resources/get-news-list`,
        { page_size: page_size },
        {
          params: { page: current_page },
          headers: { "X-API-Key": APP_KEY },
        }
      );
      const lista = decryptData(data.data, KEY_CRYPT);
      return lista ? lista : [];
    } catch (error) {
      console.error("Error fetching news list:", error);
      return null;
    }
  };

  /**
   * @brief Obtiene un pdf de una noticia asignado a una id
   */
  const fetch_news_pdf = async (id) => {
    try {
      const { data } = await axios.post(
        `${URL_BACKEND}/api/resources/get-news-pdf`,
        {
          id: id,
        },
        { headers: { "X-API-Key": APP_KEY } }
      );
      const pdf = data;
      return pdf ? pdf : [];
    } catch (error) {
      console.error("Error fetching PDF viewer:", error);
      return null;
    }
  };

  /**
   * @brief Obtiene la lista de preguntas frecuentes
   */
  const fetch_faq = async () => {
    try {
      const { data } = await axios.get(
        `${URL_BACKEND}/api/resources/getQuestions`,
        {
          headers: { "X-API-Key": APP_KEY },
        }
      );
      const faq = decryptData(data.data, KEY_CRYPT);
      return faq ? faq : [];
    } catch (error) {
      console.error("Error fetching Answers&Questions:", error);
      return [];
    }
  };

  return (
    <PublicResourseContext.Provider
      value={{
        test_postal_code,
        fetch_news_list,
        fetch_news_pdf,
        get_province_names,
        get_citys_name,
        get_address_names,
        get_substate_names,
        fetch_faq,
        DEFAULT,
      }}
    >
      {children}
    </PublicResourseContext.Provider>
  );
};

export const usePublicResources = () => {
  return useContext(PublicResourseContext);
};
