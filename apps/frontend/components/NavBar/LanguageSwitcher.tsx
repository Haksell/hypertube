import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useUserContext } from '../../src/context/UserContext';
import axios from 'axios';

const LanguageSelector: React.FC = () => {
  const router = useRouter();
  const { i18n } = useTranslation();

  const { user } = useUserContext();

  async function amendLanguage(newLocale: string) {
	try {
		if (!(newLocale && (newLocale === 'en' || newLocale === 'fr')))
		if (user) {
			const response = await axios.post(
				`http://localhost:5001/users/updatesettings`,
				{
					email: user.email,
					lastname: user.lastName,
					firstname: user.firstName,
					language: newLocale
				},
				{
					withCredentials: true,
				},
			);
			console.log(response.data)
		}
	} catch {
		;
	}
  }

  async function changeLanguage(newLocale: string) {
    const { pathname, asPath, query } = router

	await amendLanguage(newLocale);
	
    router.push({ pathname, query }, asPath, { locale: newLocale })
  }

  useEffect(() => {
	const userLanguage = user ? user.language : null
    const initialLanguage = userLanguage || router.locale || router.defaultLocale || 'en';
    i18n.changeLanguage(initialLanguage);

	// const { pathname, asPath, query } = router
    // router.push({ pathname, query }, asPath, { locale: initialLanguage })
  }, []);


  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
  ];
  return (
    <div>
      <select className='uppercase px-2 ml-3 py-2 text-xs transition-colors duration-200 border rounded-lg w-auto bg-gray-900 text-gray-200 border-gray-700 sm:text-sm'
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