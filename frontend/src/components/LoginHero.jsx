import { useEffect, useState } from 'react';
import { assetUrl } from '../api';

const SLIDES = [
  ['/demo-horses/aurora.png', '50% 42%', 'Aurora'],
  ['/demo-horses/relampago.png', '50% 45%', 'Relámpago'],
  ['/demo-horses/luna.png', '50% 40%', 'Luna'],
  ['/demo-horses/titan.png', '50% 43%', 'Titán'],
  ['/demo-horses/estrella.png', '50% 42%', 'Estrella'],
];

export default function LoginHero({ eyebrow, title, description }) {
  const [index, setIndex] = useState(0),
    [previous, setPrevious] = useState(0),
    [paused, setPaused] = useState(false);
  useEffect(() => {
    const next = (index + 1) % SLIDES.length;
    const image = new Image();
    image.src = assetUrl(SLIDES[next][0]);
  }, [index]);
  useEffect(() => {
    if (
      paused ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const timer = setInterval(
      () =>
        setIndex((current) => {
          setPrevious(current);
          return (current + 1) % SLIDES.length;
        }),
      5000
    );
    return () => clearInterval(timer);
  }, [paused]);
  const slide = (position, className) => (
    <div
      className={`login-slide ${className}`}
      style={{
        backgroundImage: `url(${assetUrl(SLIDES[position][0])})`,
        backgroundPosition: SLIDES[position][1],
      }}
    />
  );
  return (
    <section
      className="login-art"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Galería de caballos del establo"
    >
      <div className="login-slides" aria-hidden="true">
        {slide(previous, 'previous')}
        {slide(index, 'active')}
      </div>
      <div className="login-art-shade" aria-hidden="true" />
      <div className="login-art-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
