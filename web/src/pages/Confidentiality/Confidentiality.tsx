import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';
import './Confidentiality.css';

function Confidentiality() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="confidentiality-box">
        {/* Header з кнопкою назад і заголовком */}
        <div className="confidentiality-header">
          <BackButton />
          <h1 className="confidentiality-title">{t('confidentiality_page.title')}</h1>
        </div>

        {/* Контент зі скролом */}
        <div className="confidentiality-content">
          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section1.title')}</h2>
            <p>{t('confidentiality_page.section1.text1')}</p>
            <p>{t('confidentiality_page.section1.text2')}</p>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section2.title')}</h2>
            <p>{t('confidentiality_page.section2.text')}</p>
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section2.list.item1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section2.list.item2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section2.list.item3') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section2.list.item4') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section2.list.item5') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section2.list.item6') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section2.list.item7') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section2.list.item8') }} />
            </ul>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section3.title')}</h2>
            <p>{t('confidentiality_page.section3.text')}</p>
            <ul>
              <li>{t('confidentiality_page.section3.list.item1')}</li>
              <li>{t('confidentiality_page.section3.list.item2')}</li>
              <li>{t('confidentiality_page.section3.list.item3')}</li>
              <li>{t('confidentiality_page.section3.list.item4')}</li>
              <li>{t('confidentiality_page.section3.list.item5')}</li>
              <li>{t('confidentiality_page.section3.list.item6')}</li>
              <li>{t('confidentiality_page.section3.list.item7')}</li>
              <li>{t('confidentiality_page.section3.list.item8')}</li>
              <li>{t('confidentiality_page.section3.list.item9')}</li>
            </ul>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section4.title')}</h2>
            <p>{t('confidentiality_page.section4.text')}</p>
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section4.list.item1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section4.list.item2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section4.list.item3') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section4.list.item4') }} />
            </ul>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section5.title')}</h2>
            <p>{t('confidentiality_page.section5.text')}</p>
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section5.list.item1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section5.list.item2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section5.list.item3') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section5.list.item4') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section5.list.item5') }} />
            </ul>
            <p>{t('confidentiality_page.section5.text2')}</p>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section6.title')}</h2>
            <p>{t('confidentiality_page.section6.text')}</p>
            <ul>
              <li>{t('confidentiality_page.section6.list.item1')}</li>
              <li>{t('confidentiality_page.section6.list.item2')}</li>
              <li>{t('confidentiality_page.section6.list.item3')}</li>
            </ul>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section7.title')}</h2>
            <p>{t('confidentiality_page.section7.text')}</p>
            <ul>
              <li>{t('confidentiality_page.section7.list.item1')}</li>
              <li>{t('confidentiality_page.section7.list.item2')}</li>
              <li>{t('confidentiality_page.section7.list.item3')}</li>
              <li>{t('confidentiality_page.section7.list.item4')}</li>
              <li>{t('confidentiality_page.section7.list.item5')}</li>
              <li>{t('confidentiality_page.section7.list.item6')}</li>
            </ul>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section8.title')}</h2>
            <p>{t('confidentiality_page.section8.text')}</p>
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section8.list.item1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section8.list.item2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section8.list.item3') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section8.list.item4') }} />
            </ul>
            <p>{t('confidentiality_page.section8.text2')}</p>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section9.title')}</h2>
            <p>{t('confidentiality_page.section9.text')}</p>
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section9.list.item1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section9.list.item2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section9.list.item3') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section9.list.item4') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section9.list.item5') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section9.list.item6') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section9.list.item7') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section9.list.item8') }} />
            </ul>
            <p>{t('confidentiality_page.section9.text2')}</p>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section10.title')}</h2>
            <p>{t('confidentiality_page.section10.text')}</p>
            <ul>
              <li>{t('confidentiality_page.section10.list.item1')}</li>
              <li>{t('confidentiality_page.section10.list.item2')}</li>
              <li>{t('confidentiality_page.section10.list.item3')}</li>
              <li>{t('confidentiality_page.section10.list.item4')}</li>
              <li>{t('confidentiality_page.section10.list.item5')}</li>
            </ul>
            <p>{t('confidentiality_page.section10.text2')}</p>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section11.title')}</h2>
            <p>{t('confidentiality_page.section11.text')}</p>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section12.title')}</h2>
            <p>{t('confidentiality_page.section12.text')}</p>
          </div>

          <div className="confidentiality-section">
            <h2>{t('confidentiality_page.section13.title')}</h2>
            <p>{t('confidentiality_page.section13.text')}</p>
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section13.list.item1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section13.list.item2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section13.list.item3') }} />
              <li dangerouslySetInnerHTML={{ __html: t('confidentiality_page.section13.list.item4') }} />
            </ul>
          </div>

          <p className="confidentiality-date">
            {t('confidentiality_page.last_updated')}: {new Date().toLocaleDateString(t('confidentiality_page.locale'), { 
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

export default Confidentiality;