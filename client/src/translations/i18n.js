import i18n from 'i18next';
import { initReactI18next } from '../../node_modules/react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector/cjs';

import translationEN from './en/translation.json';
import translationTR from './tr/translation.json';
import serverErrorsEN from './en/serverErrors.json';
import serverErrorsTR from './tr/serverErrors.json';

const resources = {
    en: {
        translation: translationEN,
        serverErrors: serverErrorsEN
    },
    tr: {
        translation: translationTR,
        serverErrors: serverErrorsTR
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;