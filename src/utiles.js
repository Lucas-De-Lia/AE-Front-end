import CryptoJS from "crypto-js";

/**
 * @brief Verifica si el string es un numero
 * @param {Event} e  es el evento del onchange (e.target.value)
 * @returns {Boolean}
 */
export const isNum = (e) => {
  const value = e.target.value;
  if (value === "" || Number.isNaN(Number(value))) {
    return false;
  }
  return true;
};
/**
 * @brief Acorta el nombre de un archivo , toma los primeros 7 caracteres los concatena con los ultimos 7 , y entre medio agrega tres puntos.
 * @param {string} file_name Nombre de un archivo
 * @returns
 */
export const shortFileName = (file_name) => {
  if (file_name.length > 10) {
    return file_name.substr(0, 7) + "..." + file_name.substr(-7);
  }
  return file_name;
};
/**
 * @brief Combierte un pdf en base64 a un Blob
 * @param {string} data Elemento en base64 de pdf con el prefijo "data:application/pdf;base64,..."
 * @returns
 */
export const base64toBlob = (data) => {
  const base64WithoutPrefix = data.substr(
    "data:application/pdf;base64,".length
  );

  const bytes = atob(base64WithoutPrefix);
  let length = bytes.length;
  let out = new Uint8Array(length);

  while (length--) {
    out[length] = bytes.charCodeAt(length);
  }

  return new Blob([out], { type: "application/pdf" });
};
/**
 * @brief Obtiene las fechas de AE para el dia actual.
 * @returns
 */
export const getDates = () => {
  let startDay = new Date();
  let fthMonth = new Date(startDay);
  let sixMonth = new Date(startDay);
  let lastMonth = new Date(startDay);

  fthMonth.setMonth(fthMonth.getMonth() + 5);
  sixMonth.setMonth(sixMonth.getMonth() + 6);
  lastMonth.setMonth(lastMonth.getMonth() + 12);

  return {
    startDay,
    fthMonth,
    sixMonth,
    lastMonth,
  };
};
/**
 * @brief Retorna verdadero si la app esta siendo ejecutada en movile.
 * @returns {Boolean}
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};
/**
 *
 * @param {*} dates
 * @returns
 */
export const json_to_json_calendar = (dates) => {
  let result = null;
  if (dates.startDay !== null) {
    result = {};
    if (dates.hasOwnProperty("startDay")) {
      result.startDay = new Date(dates.startDay);
    }
    if (dates.hasOwnProperty("fifthMonth")) {
      result.fifthMonth = new Date(dates.fifthMonth);
    }
    if (dates.hasOwnProperty("sixthMonth")) {
      result.sixthMonth = new Date(dates.sixthMonth);
    }
    if (dates.hasOwnProperty("lastMonth")) {
      result.lastMonth = new Date(dates.lastMonth);
    }
    if (dates.hasOwnProperty("renewalMonth")) {
      result.endMonth = new Date(dates.renewalMonth);
    }
  }
  return result;
};
export const dates_to_json_calendar = (dates) => {
  let result = null;
  if (dates.startDay !== null) {
    result = {};

    if (dates.hasOwnProperty("startDay")) {
      result.startDay = parseDate(dates.startDay);
    }

    if (dates.hasOwnProperty("fifthMonth")) {
      result.fifthMonth = parseDate(dates.fifthMonth);
    }

    if (dates.hasOwnProperty("sixthMonth")) {
      result.sixthMonth = parseDate(dates.sixthMonth);
    }

    if (dates.hasOwnProperty("lastMonth")) {
      result.lastMonth = parseDate(dates.lastMonth);
    }

    if (dates.hasOwnProperty("renewalMonth")) {
      result.endMonth = parseDate(dates.renewalMonth);
    }
  }
  return result;
};
/**
 * @brief Convierte una fecha en un string separado por - con el formato "YYYY-MM-DD"
 * @param {*} date Fecha
 * @returns {string}
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day = date.getDate();
  day = day < 10 ? "0" + day : day;

  return `${year}-${month}-${day}`;
};
/**
 * @brief Toma un email(string) y lo censura obeniendo de
 *  ejemplo@dominio.com -> eje****@dom***.com
 * @param {*} email
 * @returns
 */
export const shortEmail = (email) => {
  let splitemail = email.split("@");
  let sizedom = splitemail[1].length;
  return (
    splitemail[0].substr(0, 3) +
    "****" +
    "@" +
    splitemail[1].substr(0, 3) +
    "***" +
    splitemail[1].substr(sizedom - 4, sizedom)
  );
};
function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    let value = (hash >> (i * 8)) & 0xff;
    let darkPastelValue = Math.floor(100 + (value % 56));

    color += `00${darkPastelValue.toString(16)}`.slice(-2);
  }
  return color;
}
/**
 * @brief Verifica que la fecha de input este en el rango de -18 años y -100años
 * @param {Date} inputDAte
 * @returns
 */
export const datecontrol = (inputDAte) => {
  let today = new Date();
  let yearsAgo_18 = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  let yearsAgo_100 = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  );
  return yearsAgo_100 <= inputDAte && inputDAte <= yearsAgo_18;
};
/**
 * @brief Parsea los dates de php a los de js restandole al mes 1.
 * @param {*} inputdate
 * @returns
 */
export const parseDate = (inputdate) => {
  const [year, month, day] = inputdate.split("-").map(Number);
  return new Date(year, month - 1, day);
};
/**
 * @brief Crea unaestructura con el color y las iniciales para mostrar en el Icono del perfil.
 * @param {string} name
 * @returns
 */
export const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 56,
      height: 56,
    },
    children: obtenerIniciales(name),
  };
};

function obtenerIniciales(nombre) {
  const partes = nombre.split(", ");
  const inicialNombre = partes[0][0];
  const apellido = partes.length > 1 ? partes[1] : "";
  const inicialApellido = apellido ? apellido.split(" ")[0][0] : "";
  return `${inicialNombre}${inicialApellido}`;
}
/**
 * @brief Agrega un formato al cuil, con - es decir: 1-2345678-9
 * @param {*} inputValue
 * @returns
 */
export const doformatCUIL = (inputValue) => {
  const sanitizedValue = inputValue.replace(/\D/g, "");
  const truncatedValue = sanitizedValue.slice(0, 11);
  let formatted = truncatedValue;
  if (truncatedValue.length > 2) {
    formatted = truncatedValue
      .replace(/^(\d{2})/, "$1-")
      .replace(/(\d{8})(\d{1,2})/, "$1-$2");
  }
  return formatted;
};
/**
 * @brief Elimina cualquier letra del string, lo trunca a 4 caracteres para asegurar que sea un codigo postal
 * @param {*} inputValue
 * @returns
 */
export const doPostalCode = (inputValue) => {
  const sanitizedValue = inputValue.replace(/\D/g, "");
  const truncatedValue = sanitizedValue.slice(0, 4);
  let formatted = truncatedValue;
  return formatted;
};
/**
 * @brief Realiza un parse a int y verifica que el numero sea un numero entre 0 y 50.
 * @param {string} value
 * @returns
 */
export const doFloor = (value) => {
  const floorNumber = parseInt(value, 10) || 0;
  return Math.min(Math.max(floorNumber, 0), 50).toString();
};
/**
 * @brief Verifica que el string sean solo numeros.
 * @param {*} value
 * @returns
 */
export const itsNumber = (value) => {
  return /^\d+$/.test(value);
};
/**
 * @brief Asegura que el valor del apartamentro sea o una sola letra o un solo numero.
 * @param {*} value
 * @returns
 */
export const doApartment = (value) => {
  const sanitizedValue = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  return sanitizedValue.length > 0 ? sanitizedValue.charAt(0) : "";
};
/**
 * @brief Verifica que el email tenga un formato de email
 * @param {*} email Email a testear
 * @returns
 */
export const doEmail = (email) => {
  const trimmedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmedEmail)) {
    const formattedEmail = trimmedEmail.toLowerCase();
    return formattedEmail;
  } else {
    return trimmedEmail;
  }
};
/**
 * @brief Asegura que el numero, tenga el formato de un telefono
 * @param {string} phonein
 * @returns
 */
export const doPhone = (phonein) => {
  let phone = phonein.replace(/\D/g, "");
  if (phone.length > 10) {
    phone = phone.substring(2, 12);
  }
  if (phone.length < 10) {
    return phone;
  }
  if (phone.length === 10) {
    return `+54 (${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(
      6,
      10
    )}`;
  }
};
/**
 * @brief Verifica que la constraseñas sean iguales y que cumplan con los requerimientos de almenos una letra , un numero y almenos 8 caracteres
 * @param {*} password1
 * @param {*} password2
 * @returns
 */
export const testpassword = (password1, password2) => {
  let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  return password1 === password2 ? re.test(password1) : false;
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const isToday = (day, date) => {
  return day === date.getDate();
};

export const isStartdate = (day, date, cellIndex) => {
  return cellIndex === 0;
};

export const isEnddate = (day, date, cellIndex) => {
  return cellIndex === 6;
};

export const isSameMonth = (date1, date2) => {
  return date1.getMonth() === date2.getMonth();
};

/**
 * @brief Verifica que una fecha esta dentro de un rango ,( usa mayor/menor igual)
 * @param {*} start Fecha inicial
 * @param {*} day Fecha a testear
 * @param {*} end Fecha final
 * @returns
 */
export const dateBetween = (start, day, end) => {
  return start.getDate() <= day && day <= end.getDate();
};

export const monthGreater = (date1, date2) => {
  return date1.getMonth() < date2.getMonth();
};

/**
 * @brief Retorna el verdadero indice de una celda en la lista de dias.
 * @param {} cellIndex
 * @param {*} rowIndex
 * @returns
 */
export const realIndex = (cellIndex, rowIndex) => {
  return cellIndex + 7 * rowIndex;
};

export const dayGreaterEqual = (day, date1, cellIndex, rowIndex) => {
  let dayg = date1.getDate();
  return day >= dayg || (day === null && realIndex(cellIndex, rowIndex) > dayg);
};

export const dayLessEqual = (day, date1, cellIndex, rowIndex) => {
  let dayg = date1.getDate();
  return (
    (day <= dayg && day !== null) ||
    (day === null && realIndex(cellIndex, rowIndex) < dayg)
  );
};
/**
 * @brief Verifica que dos string no tengan mas de una cantidad de diferencias.
 * @param {*} string1
 * @param {*} string2
 * @param {*} max
 * @returns
 */
export const stringDiff = (string1, string2, max) => {
  if (string1.length === string2.length) {
    let diffs = 0;
    for (let i = 0; i < string1.length; i++) {
      diffs += string1[i] !== string2[i] ? 1 : 0;
    }
    return diffs <= max;
  }
  let stringaux = string1;
  let maxstring = string2;
  let tam = Math.abs(string1.length - string2.length);
  if (string1.length > string2.length) {
    stringaux = string2;
    maxstring = string1;
  }
  stringaux = stringaux + " ".repeat(tam);
  return stringDiff(stringaux, maxstring, max);
};
/**
 * @brief Verifica que el email tenga un dominio conocido.
 */
export const emailConocido = (email) => {
  //@santafe.gov.ar esta para las pruebas
  const dominiosPermitidos = [
    "@gmail.com",
    "@outlook.com",
    "@hotmail.com",
    "@live.com",
    "@msn.com",
    "@yahoo.com",
    "@santafe.gov.ar",
  ];
  for (let i = 0; i < dominiosPermitidos.length; i++) {
    if (email.endsWith(dominiosPermitidos[i])) {
      return true;
    }
  }
  return false;
};

export const handlePaste = (event) => {
  event.preventDefault(); // Evita la acción de pegado
  // Aquí podrías mostrar un mensaje al usuario o simplemente no hacer nada
};
export const handleCopyCut = (event) => {
  event.preventDefault(); // Evita la acción de copiado o cortado
  // Aquí podrías mostrar un mensaje al usuario o simplemente no hacer nada
};

/**
 * @brief Funcion encargada encrypt data
 * @param {*} data datos
 * @param {*} key clave AES
 * @returns
 */
export const encryptData = (data, key) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const stringData = JSON.stringify(data);
  const hash = CryptoJS.SHA256(stringData);
  const encryptedData = CryptoJS.AES.encrypt(
    stringData,
    CryptoJS.enc.Base64.parse(key),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  const encrypted = iv.concat(encryptedData.ciphertext);
  return CryptoJS.enc.Base64.stringify(encrypted.concat(hash));
};

/**
 * @brief Funcion encrypt data
 * @param {*} encryptedData data encryptada
 * @param {*} key calve AES
 * @returns
 */
export const decryptData = (encryptedBase64, key) => {
  const encrypted = CryptoJS.enc.Base64.parse(encryptedBase64);
  const hash = CryptoJS.lib.WordArray.create(
    encrypted.words.slice(encrypted.words.length - 8),
    32
  );
  const iv = CryptoJS.lib.WordArray.create(encrypted.words.slice(0, 4), 16);
  const encryptedData = CryptoJS.lib.WordArray.create(
    encrypted.words.slice(4, encrypted.words.length - 8),
    encrypted.sigBytes - 16 - 32
  );
  const stringData = CryptoJS.AES.decrypt(
    {
      ciphertext: encryptedData,
    },
    CryptoJS.enc.Base64.parse(key),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  const hash2 = CryptoJS.SHA256(stringData.toString(CryptoJS.enc.Utf8));
  if ( !hash2 ===hash)  {
    throw new Error("Invalid hash");
  }
  return JSON.parse(stringData.toString(CryptoJS.enc.Utf8));
};

const utiles = {
  handlePaste,
  decryptData,
  encryptData,
  handleCopyCut,
  isStartdate,
  isEnddate,
  isSameMonth,
  dayLessEqual,
  monthGreater,
  dayGreaterEqual,
  realIndex,
  dateBetween,
  isToday,
  isNum,
  testpassword,
  shortFileName,
  getDates,
  stringAvatar,
  doformatCUIL,
  datecontrol,
  doPostalCode,
  doFloor,
  doApartment,
  base64toBlob,
  doPhone,
  doEmail,
  parseDate,
  emailConocido,
  formatDate,
  sleep,
};
export default utiles;
