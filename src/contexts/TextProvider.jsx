import { createContext, useContext } from "react";
import LangString from "../contexts/text/es_AR.json";

/**
 * @typedef {Object} WithChildren
 * @property {React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]} children
 */

/**
 * Obtiene el texto de ( context/text ) y aqui esta definido una serie de funciones que devuelven una estructura JSON 
 * Con los textos , de esta manera podemos modificar los textos sin cambiar el codigo.
 */
const baseTextContext = createContext(LangString);

export function useRootFAQString() {
  return useContext(baseTextContext).public.root.faq;
}

export function useRootFooterString() {
  return useContext(baseTextContext).public.root.footer;
}

export function useRootTopbarString() {
  return useContext(baseTextContext).public.root.topbar;
}

export function useCommonsButtonString() {
  return useContext(baseTextContext).public.commons.button;
}

export function useCommonsFieldString() {
  return useContext(baseTextContext).public.commons.field;
}

export function useCommonsTextString() {
  return useContext(baseTextContext).public.commons.text;
}

export function useComponentAECreateString() {
  return useContext(baseTextContext).public.component.ae.create;
}

export function useComponentAEFinalizeString() {
  return useContext(baseTextContext).public.component.ae.finalize;
}

export function useComponentAEProfileString() {
  return useContext(baseTextContext).public.component.ae.profile;
}
export function useComponentAuthLoginString() {
  return useContext(baseTextContext).public.component.auth.login;
}
export function useComponentAuthRegisterString() {
  return useContext(baseTextContext).public.component.auth.register;
}

export function useComponentEmailChangeString() {
  return useContext(baseTextContext).public.component.email.change;
}

export function useComponentEmailVerifyString() {
  return useContext(baseTextContext).public.component.email.verify;
}

export function useComponentEmailSendString() {
  return useContext(baseTextContext).public.component.email.send;
}

export function useComponentPasswordAlertString() {
  return useContext(baseTextContext).public.component.password.alert;
}
export function useComponentPasswordChangeString() {
  return useContext(baseTextContext).public.component.password.change;
}

export function useComponentPasswordForgotString() {
  return useContext(baseTextContext).public.component.password.forgot;
}

export function useComponentPasswordResetString() {
  return useContext(baseTextContext).public.component.password.reset;
}

export function useComponentMessageErrorString() {
  return useContext(baseTextContext).public.component.message.error;
}

export function useComponentMessageSuccessString() {
  return useContext(baseTextContext).public.component.message.success;
}

export function useFormAddressString() {
  return useContext(baseTextContext).public.component.auth.register.step
    .address;
}

export function useFormDatePlanString() {
  return useContext(baseTextContext).public.component.auth.register.step
    .date_plane;
}

export function useFormExtraString() {
  return useContext(baseTextContext).public.component.auth.register.step.extra;
}

export function useFormFileAttachString() {
  return useContext(baseTextContext).public.component.auth.register.step
    .file_attach;
}

export function useFormInfoString() {
  return useContext(baseTextContext).public.component.auth.register.step.info;
}

export function useLoadingAlertString() {
  return useContext(baseTextContext).public.commons.loading;
}

export function useNewsInfoAlert(){
  return useContext(baseTextContext).public.component.news;
}

const Strings = {
  useRootFAQString,
  useNewsInfoAlert,
  useRootFooterString,
  useRootTopbarString,
  useCommonsButtonString,
  useCommonsFieldString,
  useCommonsTextString,
  useComponentAECreateString,
  useComponentAEFinalizeString,
  useComponentAEProfileString,
  useComponentAuthLoginString,
  useComponentAuthRegisterString,
  useComponentEmailChangeString,
  useComponentEmailSendString,
  useComponentPasswordAlertString,
  useComponentPasswordChangeString,
  useComponentPasswordForgotString,
  useComponentPasswordResetString,
  useComponentMessageErrorString,
  useComponentMessageSuccessString,
  useFormAddressString,
  useFormDatePlanString,
  useFormExtraString,
  useFormFileAttachString,
  useFormInfoString,
};
export default Strings;
