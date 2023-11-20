/**import React from 'react'
import { useTranslation } from 'next-i18next'

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    console.log(i18n.changeLanguage(language));
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
  ];

  return (
    <div>
      <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language}>
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
**/
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const LanguageSelector: React.FC = () => {
  const router = useRouter();
  const { i18n } = useTranslation();

  const changeLanguage = (newLocale: string) => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, { locale: newLocale })
  }

  useEffect(() => {
    const initialLanguage = router.locale || router.defaultLocale || 'en';
    i18n.changeLanguage(initialLanguage);
  }, []);


  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
  ];
  return (
    <div>
      <select className='uppercase px-2 ml-3 py-2 text-sm transition-colors duration-200 border rounded-lg w-auto bg-gray-900 text-gray-200 border-gray-700'
        onChange={(e) => changeLanguage(e.target.value)} value={i18n.language}>
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value}
            </option>
          ))}
      </select>
    </div>
  );
};

export default LanguageSelector;