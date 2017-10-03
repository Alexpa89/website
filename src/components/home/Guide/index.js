/**
 * Created by flb on 17/08/2017.
 */

import { ContentGuide } from '~/content';
import style from './style.css';
import { Button } from 'react-toolbox/lib/button/index';

export default function Guide() {
  return (
    <section className={style.guide}>
      <img src="/assets/home/gallery/home-gallery-1-o.jpg" />
      <h3>
        {ContentGuide.texts.title}
      </h3>
      {ContentGuide.texts.text.map((p) => (
        <p>{p}</p>
      ))}
      <Button theme={style}>
        {ContentGuide.texts['button-download']}
      </Button>
      <div style={{ clear: 'both' }} />
    </section>
  );
}
