import { useState } from "react";

export const useForm = (initialForm = {}, initialErrors = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const onInputChangeForCheck = ({ target }) => {
    const { name, checked } = target;
    setFormState({
      ...formState,
      [name]: checked,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const onInputChangeForRadio = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value === "true",
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const changeFormState = (name, value) => {
    setFormState({
      ...formState,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = (fieldsToValidate = []) => {
    const newErrors = {};

    for (const field of fieldsToValidate) {
      const value = formState[field];
      if (value === "" || value === null || value === undefined) {
        newErrors[field] = "Este campo es obligatorio";
      }
    }
    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      newErrors,
    };
  };

  const onResetForm = () => {
    setFormState(initialForm);
    setErrors({});
  };
  return {
    ...formState,
    formState,
    errors,
    setErrors,
    onInputChange,
    onResetForm,
    onInputChangeForCheck,
    onInputChangeForRadio,
    changeFormState,
    validate,
  };
};
