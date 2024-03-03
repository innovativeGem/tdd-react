import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  return (
    <>
      <img
        src='https://flagsapi.com/TR/flat/24.png'
        alt='Turkish Flag'
        title='Türkçe'
        onClick={() => i18n.changeLanguage('tr')}
      />

      <img
        src='https://flagsapi.com/GB/flat/24.png'
        alt='English Flag'
        title='English'
        onClick={() => i18n.changeLanguage('en')}
      />
    </>
  );
};

export default LanguageSelector;
