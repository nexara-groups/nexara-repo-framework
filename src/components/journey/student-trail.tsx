import { JourneyMeterLoader } from "./journey-meter-loader.client";

const PHASES = [
  { title: "Find the direction", body: "A guided conversation helps identify the role, domain and learning format that fit your current position." },
  { title: "Build the route", body: "A visible curriculum turns a broad ambition into a sequence of foundations, tools and applied work." },
  { title: "Practice the work", body: "Labs and project activity make the learning concrete and expose the next skills to strengthen." },
  { title: "Review the evidence", body: "Feedback helps sharpen your work, explain your decisions and prepare a stronger next attempt." },
  { title: "Prepare the transition", body: "Resume preparation, mock interviews and relevant opportunity support help you communicate what you can do. This is support, not an employment guarantee." },
] as const;

/**
 * Server Component. Every step is rendered here as plain markup, each
 * carrying its own visible number ("01"..."05") in reading order, so the
 * section is fully readable with no script, before hydration, and under
 * `prefers-reduced-motion`. `JourneyMeterLoader` (a Client Component) is the
 * only piece that lazily pulls in GSAP to drive the sticky counter once the
 * browser is ready for it.
 *
 * The meter duplicates information the steps already expose (a running
 * "NN / 05" count), so it is marked `aria-hidden="true"` -- assistive
 * technology gets the one authoritative reading order from `.journey__steps`
 * instead of a second, decorative one from the sticky panel.
 */
export function StudentTrail() {
  return (
    <section className="journey section" aria-labelledby="journey-title">
      <div className="shell journey__head">
        <p className="mono">Student transformation</p>
        <h1 id="journey-title">
          A path becomes real
          <br />
          when the work changes.
        </h1>
        <p>Yojo&rsquo;s learner route is designed to make progress visible, useful and easier to explain.</p>
      </div>

      <div className="shell journey__layout">
        <aside className="journey__meter" aria-hidden="true">
          <p className="mono">
            <b data-journey-counter>01</b> / 05
          </p>
        </aside>
        <ol className="journey__steps">
          {PHASES.map((phase, index) => (
            <li key={phase.title} data-journey-step={index}>
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <h2>{phase.title}</h2>
              <p>{phase.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <JourneyMeterLoader />
    </section>
  );
}
