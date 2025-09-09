import { useTranslation } from 'react-i18next';

export const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('pages.pageNotFound')}</h1>
    </div>
  );
};
