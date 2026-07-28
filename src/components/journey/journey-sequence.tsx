import { JOURNEY_STAGES } from "../../content/journey";
import { ContactActions } from "../contact/contact-actions";
import { JourneySequenceMotionLoader } from "./journey-sequence-motion-loader.client";
import { JourneyStageArt } from "./journey-stage-art";

interface JourneySequenceProps {
  readonly standalone?: boolean;
}

export function JourneySequence({ standalone = false }: JourneySequenceProps) {
  const JourneyHeading = standalone ? "h1" : "h2";

  return (
    <section
      className={`journey-route section${standalone ? " journey-route--standalone" : ""}`}
      id="journey"
      aria-labelledby="journey-title"
    >
      <div className="shell journey-route__intro">
        <p className="eyebrow">The student journey</p>
        <JourneyHeading id="journey-title">
          Build your path one decision at a time.
        </JourneyHeading>
        <p>
          Five connected decisions take you from a starting point to evidence you can present.
        </p>
      </div>

      <div className="shell journey-route__track" data-journey-track>
        <ol className="journey-route__steps">
          {JOURNEY_STAGES.map((stage, index) => (
            <li
              key={stage.id}
              className={`journey-route__step journey-route__step--${
                index % 2 === 0 ? "left" : "right"
              }`}
            >
              <article
                className="journey-route__card"
                data-route-card={index}
                data-active={index === 0 || undefined}
              >
                <div className="journey-route__copy">
                  <span className="journey-route__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2>{stage.title}</h2>
                  <p>{stage.body}</p>
                  <ul aria-label={`${stage.title} checkpoints`}>
                    {stage.checkpoints.map((checkpoint) => (
                      <li key={checkpoint}>{checkpoint}</li>
                    ))}
                  </ul>
                  <strong>
                    <span>Outcome</span>
                    {stage.outcome}
                  </strong>
                </div>

                <figure className="journey-route__media">
                  <JourneyStageArt stageId={stage.id} label={stage.artDescription} />
                </figure>
              </article>

              {index < JOURNEY_STAGES.length - 1 && (
                <div
                  className="journey-route__bridge"
                  data-route-bridge
                  data-direction={index % 2 === 0 ? "forward" : "reverse"}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 1000 260" preserveAspectRatio="none">
                    <path
                      className="journey-route__path journey-route__path--base"
                      d={
                        index % 2 === 0
                          ? "M333 0 V68 Q333 130 395 130 H605 Q667 130 667 192 V260"
                          : "M667 0 V68 Q667 130 605 130 H395 Q333 130 333 192 V260"
                      }
                      pathLength="1"
                    />
                    <path
                      className="journey-route__path journey-route__path--signal"
                      data-route-path
                      d={
                        index % 2 === 0
                          ? "M333 0 V68 Q333 130 395 130 H605 Q667 130 667 192 V260"
                          : "M667 0 V68 Q667 130 605 130 H395 Q333 130 333 192 V260"
                      }
                      pathLength="1"
                    />
                    <circle
                      className="journey-route__node"
                      data-route-node
                      cx={index % 2 === 0 ? "333" : "667"}
                      cy="0"
                      r="8"
                    />
                    <circle
                      className="journey-route__node"
                      data-route-node
                      cx={index % 2 === 0 ? "667" : "333"}
                      cy="260"
                      r="8"
                    />
                  </svg>
                  <span className="journey-route__mobile-line" data-route-mobile-line />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>

      {standalone && (
        <div className="shell journey-route__cta">
          <h2>Ready to choose your starting point?</h2>
          <ContactActions message="Hello Yojo Solutions, I want help choosing the right programme and starting point." />
        </div>
      )}

      <JourneySequenceMotionLoader />
    </section>
  );
}
