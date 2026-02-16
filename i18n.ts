import {getRequestConfig} from 'next-intl/server';
import {getUserLocale} from './config/locale';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();
  
  // Carga el archivo de mensajes principal (messages/[locale].json)
  // El archivo cargado debe contener TODAS las traducciones (ej: Form, Footer, Navbar, etc.)
  const messages = (await import(`./messages/${locale}.json`)).default;

  return {
    locale,
    messages: messages,
  };
});