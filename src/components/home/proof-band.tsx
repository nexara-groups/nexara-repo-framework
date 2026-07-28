import Link from "next/link";
import { OUTCOME_STATS } from "../../content/outcomes";

export function ProofBand() {
  return (
    <section className="section home-proof" aria-label="Training and placement figures">
      <div className="shell">
        <ul className="home-proof__grid">
          {OUTCOME_STATS.map((stat) => (
            <li key={stat.label}>
              <span className="home-proof__value">{stat.value}</span>
              <span className="home-proof__label">{stat.label}</span>
            </li>
          ))}
        </ul>
        <p className="home-proof__note">
          Some figures are indicative and being verified —{" "}
          <Link href="/outcomes">see Outcomes for how we count</Link>.
        </p>
      </div>
    </section>
  );
}
