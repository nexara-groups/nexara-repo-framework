import Image from "next/image";
import { ContactActions } from "../contact/contact-actions";

export function SecurityHero() {
  return (
    <section className="hero security-hero" aria-labelledby="hero-title">
      <div className="security-hero__media" aria-hidden="true">
        <Image
          className="security-hero__poster"
          src="/media/cyber/hero-signal.jpg"
          alt=""
          width={1915}
          height={821}
          priority
        />
        <video
          className="security-hero__video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/media/cyber/hero-signal.jpg"
        >
          <source src="/media/cyber/hero-signal-loop.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="security-hero__scrim" aria-hidden="true" />

      <div className="shell security-hero__layout">
        <div className="security-hero__content">
          <p className="eyebrow">Cybersecurity learning and services</p>
          <h1 id="hero-title">
            <span>Learn the systems.</span>
            <span>Defend the real world.</span>
          </h1>
          <p className="security-hero__summary">
            Practical cyber training, career support, and security consulting built around real
            operational work.
          </p>
          <ContactActions message="Hello Yojo Solutions, I want to discuss a cybersecurity or technology programme." />
        </div>
      </div>
    </section>
  );
}
