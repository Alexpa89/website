import style from './style.css';

const Guide = () => (
  <div className={style.guide}>
    <div className="grid-2">
      <div className="one-half">
        <h2>Notre guide logement offert</h2>
        <div className="grid-2">
          <ul className="one-half">
            <li className={style.guideBullet}>
              <i className="picto-picto_guide_logement" />
              Où chercher son logement
            </li>
            <li className={style.guideBullet}>
              <i className="picto-picto_guide_logement" />
              Agences, résidences...
            </li>
          </ul>
          <ul className="one-half">
            <li className={style.guideBullet}>
              <i className="picto-picto_guide_logement" />
              Les pièges à éviter
            </li>
            <li className={style.guideBullet}>
              <i className="picto-picto_guide_logement" />
              Les frais à prévoir
            </li>
          </ul>
        </div>
        <div>
          <a href="/" className={style.downloadGuideBtn}>
            <span>Je télécharge mon Guide Logement</span>
            <i className="picto-picto_fleche_guide_logement_64px" />
          </a>
        </div>
      </div>
      <div className="one-half">
        <div className={style.guideImg} />
      </div>
    </div>
  </div>
);


export default Guide;

