import React, { cloneElement, useState } from "react";
/**
 * @brief Componente que permite bloquear un elemento por 30 segundos y luego desbloquearlo
 * Usado para el boton de "reenviar mail de verificación" y "la recuperacion de cuenta"
 */
const SixtysecFragment = (props) => {
  //Variables de estado
  // si fue clickeado
  const [click, setClick] = useState(false);
  //tiempo resatante para ser activado nuevamente
  const [timeLeft, setTimeLeft] = useState(31);

  /**
   * @brief Funcion encargada de gestionar el click del elemento
   * Si sno se clickeo espera 30 segundos , si no se hizo click realiza la accion
   */
  const handleClick = async (event) => {
    if (!click) {
      const result = await props.action();
      if (!result) {
        return;
      }
      setTimeLeft(30);
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      setClick(true);
      setTimeout(() => {
        clearInterval(intervalId);
        setClick(false);
      }, 31000);
    }
  };

  const handleLabel = () => {
    return (
      <>
        {props.label}
        {click ? (
          <span style={{ marginLeft: "9px", color: "#d6dbdf " }}>
            {timeLeft}s
          </span>
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <>
      {cloneElement(
        props.children,
        {
          onClick: handleClick,
          disabled: click,
          size: "small",
          style: click
            ? {
                marginLeft: "9px",
                color: "#d6dbdf ",
                textDecorationColor: "#d6dbdf ",
              }
            : null,
        },
        handleLabel()
      )}
    </>
  );
};

export default SixtysecFragment;
