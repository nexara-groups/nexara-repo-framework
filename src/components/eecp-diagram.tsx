export function EecpNaturalBypass() {
  return (
    <figure className="eecp-bypass" aria-label="Animated diagram: over a course of EECP, small collateral blood vessels open around a narrowed artery, forming natural detours for blood flow.">
      <svg viewBox="0 0 440 260" role="img" focusable="false" aria-label="A narrowed artery with small collateral vessels opening around it as natural detours">
        {/* Main artery with a narrowed middle */}
        <path className="bypass-artery" d="M14 130 C 90 130 128 118 168 118 C 200 118 205 142 220 142 C 235 142 240 118 272 118 C 312 118 350 130 426 130" />
        <path className="bypass-artery bypass-artery-inner" d="M14 130 C 90 130 128 118 168 118 C 200 118 205 142 220 142 C 235 142 240 118 272 118 C 312 118 350 130 426 130" />
        {/* Collateral routes drawing themselves in */}
        <path className="bypass-collateral bypass-c1" d="M150 118 C 170 62 270 62 290 118" />
        <path className="bypass-collateral bypass-c2" d="M162 126 C 190 196 250 196 278 126" />
        {/* Flow dots along the main artery */}
        <circle className="bypass-dot bypass-d1" cx="0" cy="0" r="4.5" />
        <circle className="bypass-dot bypass-d2" cx="0" cy="0" r="4.5" />
        <text className="mech-label" x="182" y="172">Narrowed</text>
        <text className="mech-label" x="152" y="40">New collateral routes</text>
      </svg>
      <figcaption>
        <span className="pulse-icon" aria-hidden="true" />
        <span>Repeated sessions encourage collateral vessels — your body&rsquo;s own detours.</span>
      </figcaption>
    </figure>
  );
}

export function EecpCourseGrid() {
  return (
    <div className="eecp-course-grid" role="img" aria-label="Grid of 35 dots: one for each daily one-hour session, five days a week for seven weeks.">
      {Array.from({ length: 35 }, (_, i) => (
        <span key={i} className="course-dot" style={{ animationDelay: `${i * 55}ms` }} />
      ))}
      <div className="course-axis"><small>Week 1</small><small>Week 7</small></div>
    </div>
  );
}
