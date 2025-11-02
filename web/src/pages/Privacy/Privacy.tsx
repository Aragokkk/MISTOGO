import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';
import './Privacy.css';

function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="privacy-box">
        {/* Header з кнопкою назад і заголовком */}
        <div className="privacy-header">
          <BackButton />
          <h1 className="privacy-title">{t('privacy_page.title')}</h1>
        </div>

        {/* Контент зі скролом */}
        <div className="privacy-content">
          <div className="privacy-section">
            <h2>{t('privacy_page.section1.title')}</h2>
            <p>{t('privacy_page.section1.text1')}</p>
            <p>{t('privacy_page.section1.text2')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy_page.section2.title')}</h2>
            <p>{t('privacy_page.section2.text1')}</p>
            <ul>
              <li>{t('privacy_page.section2.list.item1')}</li>
              <li>{t('privacy_page.section2.list.item2')}</li>
              <li>{t('privacy_page.section2.list.item3')}</li>
              <li>{t('privacy_page.section2.list.item4')}</li>
            </ul>
            <p>{t('privacy_page.section2.text2')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy_page.section3.title')}</h2>
            <p>{t('privacy_page.section3.text1')}</p>
            <ul>
              <li>{t('privacy_page.section3.list.item1')}</li>
              <li>{t('privacy_page.section3.list.item2')}</li>
              <li>{t('privacy_page.section3.list.item3')}</li>
              <li>{t('privacy_page.section3.list.item4')}</li>
            </ul>
            <p>{t('privacy_page.section3.text2')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy_page.section4.title')}</h2>
            <p>{t('privacy_page.section4.text1')}</p>
            <ul>
              <li>{t('privacy_page.section4.list.item1')}</li>
              <li>{t('privacy_page.section4.list.item2')}</li>
              <li>{t('privacy_page.section4.list.item3')}</li>
              <li>{t('privacy_page.section4.list.item4')}</li>
              <li>{t('privacy_page.section4.list.item5')}</li>
              <li>{t('privacy_page.section4.list.item6')}</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy_page.section5.title')}</h2>
            <p>{t('privacy_page.section5.text1')}</p>
            <ul>
              <li>{t('privacy_page.section5.list.item1')}</li>
              <li>{t('privacy_page.section5.list.item2')}</li>
              <li>{t('privacy_page.section5.list.item3')}</li>
              <li>{t('privacy_page.section5.list.item4')}</li>
            </ul>
            <p>{t('privacy_page.section5.text2')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy_page.section6.title')}</h2>
            <p>{t('privacy_page.section6.text1')}</p>
            <ul>
              <li>{t('privacy_page.section6.list.item1')}</li>
              <li>{t('privacy_page.section6.list.item2')}</li>
              <li>{t('privacy_page.section6.list.item3')}</li>
              <li>{t('privacy_page.section6.list.item4')}</li>
            </ul>
            <p>{t('privacy_page.section6.text2')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy_page.section7.title')}</h2>
            <p>{t('privacy_page.section7.text')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy_page.section8.title')}</h2>
            <p>{t('privacy_page.section8.text')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy_page.section9.title')}</h2>
            <p>{t('privacy_page.section9.text')}</p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy_page.section10.title')}</h2>
            <p>{t('privacy_page.section10.text')}</p>
            <ul>
              <li>{t('privacy_page.section10.list.item1')}</li>
              <li>{t('privacy_page.section10.list.item2')}</li>
              <li>{t('privacy_page.section10.list.item3')}</li>
            </ul>
          </div>

          <p className="privacy-date">
            {t('privacy_page.last_updated')}: {new Date().toLocaleDateString(t('privacy_page.locale'), { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Privacy;