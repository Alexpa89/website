import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button';
import Utils                  from '~/utils';
import style                  from './style.css';

function Guide({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div className={style.guide}>
        <div className="grid-2">
          <div className="one-half">
            <h2>
              <Text id="guide">Guide logement gratuit</Text>
            </h2>
            <div className="grid-2">
              <ul className="one-half">
                <li className={style.guideBullet}>
                  <i className="picto-picto_guide_logement" />
                  <Text id="where">Où chercher son logement</Text>
                </li>
                <li className={style.guideBullet}>
                  <i className="picto-picto_guide_logement" />
                  <Text id="agency">Agences, résidences...</Text>
                </li>
              </ul>
              <ul className="one-half">
                <li className={style.guideBullet}>
                  <i className="picto-picto_guide_logement" />
                  <Text id="traps">Les pièges à éviter</Text>
                </li>
                <li className={style.guideBullet}>
                  <i className="picto-picto_guide_logement" />
                  <Text id="fees">Les frais à prévoir</Text>
                </li>
              </ul>
            </div>
            <div>
              <Button raised icon="file_download" className={style.guideBtn}>
                <Text id="download">Obtenir le guide logement</Text>
              </Button>
            </div>
          </div>
          <div className="one-half">
            <div className={style.guideImg} />
          </div>
        </div>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  guide: '',
  where: '',
  agency: '',
  traps: '',
  fees: '',
  download: '',
} };

export default Utils.connectLang(Guide);
