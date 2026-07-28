import Link from "next/link";

export function EventsTeaser() {
  return (
    <section className="section home-events" aria-labelledby="home-events-title">
      <div className="shell home-events__inner">
        <div>
          <p className="eyebrow">This week</p>
          <h2 id="home-events-title">Watch a real class before you commit.</h2>
          <p>
            Free demo classes and career Q&amp;As run most weeks, online and at our Madhurawada
            centre in Visakhapatnam. No fee, no pressure to enrol.
          </p>
        </div>
        <Link className="button button--secondary" href="/events">
          Get the next dates
        </Link>
      </div>
    </section>
  );
}
