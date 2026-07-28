import Image from "next/image";
import Link from "next/link";
import { ContactActions } from "../contact/contact-actions";

export function GuidanceCard() {
  return (
    <section className="section home-career" aria-labelledby="career-title">
      <div className="shell home-career__grid reveal">
        <div className="home-career__visual">
          <Image
            src="/media/cyber/consulting-review.jpg"
            alt="Cybersecurity consultants reviewing infrastructure and network risk"
            width={1672}
            height={941}
          />
        </div>

        <div className="home-career__content">
          <h2 id="career-title">Skills for careers. Security for operations.</h2>
          <p>
            Yojo combines practical technology learning with cybersecurity and IT consulting for
            organisations that need a clear next move.
          </p>

          <div className="home-career__paths">
            <Link href="/placement-and-career-services">
              <strong>Career preparation</strong>
              <span>Resume, interview, referral, and internship support where relevant.</span>
            </Link>
            <Link href="/services">
              <strong>Organisation services</strong>
              <span>Cybersecurity, IT consulting, physical security, and staffing.</span>
            </Link>
          </div>
          <ContactActions compact message="Hello Yojo Solutions, I want to discuss training or organisation services." />
        </div>
      </div>
    </section>
  );
}
