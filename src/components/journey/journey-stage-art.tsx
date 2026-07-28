import type { JourneyStageId } from "../../content/journey";

interface JourneyStageArtProps {
  readonly stageId: JourneyStageId;
  readonly label: string;
}

function ArtDefs({ id }: { readonly id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-signal`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#d9f8ff" />
        <stop offset="0.44" stopColor="#75d7ec" />
        <stop offset="1" stopColor="#2388a5" />
      </linearGradient>
      <radialGradient id={`${id}-field`}>
        <stop offset="0" stopColor="#75d7ec" stopOpacity="0.2" />
        <stop offset="1" stopColor="#75d7ec" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-scan`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#75d7ec" stopOpacity="0" />
        <stop offset="0.5" stopColor="#75d7ec" stopOpacity="0.42" />
        <stop offset="1" stopColor="#75d7ec" stopOpacity="0" />
      </linearGradient>
      <pattern id={`${id}-grid`} width="34" height="34" patternUnits="userSpaceOnUse">
        <path d="M34 0H0V34" className="journey-art__grid-line" />
      </pattern>
      <filter id={`${id}-soft-glow`} x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="7" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function ArtGround({ id }: { readonly id: string }) {
  return (
    <>
      <rect width="680" height="520" fill={`url(#${id}-grid)`} opacity="0.46" />
      <ellipse
        cx="354"
        cy="270"
        rx="286"
        ry="220"
        fill={`url(#${id}-field)`}
        data-art-float
      />
      <path
        d="M52 444H628"
        className="journey-art__line journey-art__line--quiet"
        pathLength={1}
        data-art-line
      />
    </>
  );
}

function AssessArt({ id }: { readonly id: string }) {
  return (
    <>
      <g data-art-orbit>
        <circle cx="340" cy="254" r="174" className="journey-art__orbit" />
        <circle cx="340" cy="254" r="132" className="journey-art__orbit journey-art__orbit--inner" />
        <path
          d="M340 80A174 174 0 0 1 507 205"
          className="journey-art__line journey-art__line--signal"
          pathLength={1}
          data-art-line
        />
        <path
          d="M172 298A174 174 0 0 1 279 91"
          className="journey-art__line journey-art__line--signal journey-art__line--dim"
          pathLength={1}
          data-art-line
        />
      </g>

      <g data-art-panel>
        <path
          d="M340 132L444 175V255C444 326 401 379 340 405C279 379 236 326 236 255V175L340 132Z"
          className="journey-art__plane journey-art__shield"
        />
        <path
          d="M340 160L416 191V253C416 306 385 346 340 369C295 346 264 306 264 253V191L340 160Z"
          className="journey-art__line journey-art__line--signal"
          pathLength={1}
          data-art-line
        />
        <path
          d="M307 254L331 278L378 224"
          className="journey-art__line journey-art__line--strong"
          pathLength={1}
          data-art-line
        />
      </g>

      <g className="journey-art__measure" data-art-panel>
        <path d="M82 168H179" className="journey-art__line" pathLength={1} data-art-line />
        <path d="M82 198H146" className="journey-art__line" pathLength={1} data-art-line />
        <path d="M82 228H164" className="journey-art__line" pathLength={1} data-art-line />
        <circle cx="179" cy="168" r="5" className="journey-art__node" data-art-node />
        <circle cx="146" cy="198" r="5" className="journey-art__node" data-art-node />
        <circle cx="164" cy="228" r="5" className="journey-art__node" data-art-node />
      </g>

      <g className="journey-art__measure" data-art-panel>
        <path d="M501 302H598" className="journey-art__line" pathLength={1} data-art-line />
        <path d="M534 332H598" className="journey-art__line" pathLength={1} data-art-line />
        <path d="M516 362H598" className="journey-art__line" pathLength={1} data-art-line />
        <circle cx="501" cy="302" r="5" className="journey-art__node" data-art-node />
        <circle cx="534" cy="332" r="5" className="journey-art__node" data-art-node />
        <circle cx="516" cy="362" r="5" className="journey-art__node" data-art-node />
      </g>

      <rect
        x="176"
        y="242"
        width="328"
        height="24"
        fill={`url(#${id}-scan)`}
        className="journey-art__scan"
        data-art-scan
      />
    </>
  );
}

function ChooseArt() {
  return (
    <>
      <g data-art-panel>
        <circle cx="134" cy="260" r="56" className="journey-art__plane" />
        <circle cx="134" cy="260" r="15" className="journey-art__node" data-art-node />
        <circle cx="134" cy="260" r="31" className="journey-art__orbit journey-art__orbit--inner" />
      </g>

      <path
        d="M190 260H246C277 260 282 151 320 151H476"
        className="journey-art__line journey-art__line--dim"
        pathLength={1}
        data-art-line
      />
      <path
        d="M190 260H476"
        className="journey-art__line journey-art__line--strong"
        pathLength={1}
        data-art-line
      />
      <path
        d="M190 260H246C277 260 282 369 320 369H476"
        className="journey-art__line journey-art__line--dim"
        pathLength={1}
        data-art-line
      />

      <g data-art-panel>
        <rect x="476" y="103" width="126" height="96" rx="24" className="journey-art__plane" />
        <path
          d="M539 126L570 139V163C570 184 557 200 539 208C521 200 508 184 508 163V139L539 126Z"
          className="journey-art__line"
          pathLength={1}
          data-art-line
        />
        <circle cx="476" cy="151" r="7" className="journey-art__node journey-art__node--muted" data-art-node />
      </g>

      <g data-art-panel>
        <rect x="462" y="212" width="154" height="96" rx="24" className="journey-art__plane journey-art__plane--active" />
        <path
          d="M509 273L526 256L509 239M569 239L552 256L569 273"
          className="journey-art__line journey-art__line--strong"
          pathLength={1}
          data-art-line
        />
        <circle cx="462" cy="260" r="9" className="journey-art__node" data-art-node />
      </g>

      <g data-art-panel>
        <rect x="476" y="321" width="126" height="96" rx="24" className="journey-art__plane" />
        <path
          d="M512 378C506 358 523 343 541 352C553 334 582 344 580 367C594 372 593 396 575 399H520C500 397 497 382 512 378Z"
          className="journey-art__line"
          pathLength={1}
          data-art-line
        />
        <circle cx="476" cy="369" r="7" className="journey-art__node journey-art__node--muted" data-art-node />
      </g>
    </>
  );
}

function RouteArt() {
  const nodes = [
    { x: 104, y: 374 },
    { x: 214, y: 314 },
    { x: 326, y: 330 },
    { x: 442, y: 232 },
    { x: 576, y: 154 },
  ] as const;

  return (
    <>
      <path
        d="M104 374C151 374 165 314 214 314C260 314 277 330 326 330C372 330 393 232 442 232C494 232 521 154 576 154"
        className="journey-art__line journey-art__line--strong journey-art__route-line"
        pathLength={1}
        data-art-line
      />
      <path
        d="M104 404C172 404 184 349 244 349C309 349 327 372 386 372C456 372 475 292 548 292"
        className="journey-art__line journey-art__line--quiet"
        pathLength={1}
        data-art-line
      />

      {nodes.map((node, index) => (
        <g key={`${node.x}-${node.y}`} data-art-panel>
          <circle cx={node.x} cy={node.y} r={index === 4 ? 24 : 17} className="journey-art__node-shell" />
          <circle cx={node.x} cy={node.y} r={index === 4 ? 8 : 6} className="journey-art__node" data-art-node />
        </g>
      ))}

      <g data-art-panel>
        <path d="M90 135H202L224 157V235H90Z" className="journey-art__plane" />
        <path d="M111 168H190M111 193H172" className="journey-art__line" pathLength={1} data-art-line />
      </g>
      <g data-art-panel>
        <path d="M268 102H380L402 124V202H268Z" className="journey-art__plane" />
        <path d="M289 135H368M289 160H350" className="journey-art__line" pathLength={1} data-art-line />
      </g>
      <g data-art-panel>
        <path d="M452 310H564L586 332V410H452Z" className="journey-art__plane" />
        <path d="M473 343H552M473 368H534" className="journey-art__line" pathLength={1} data-art-line />
      </g>

      <path
        d="M557 113L576 94L595 113M576 96V154"
        className="journey-art__line journey-art__line--strong"
        pathLength={1}
        data-art-line
      />
    </>
  );
}

function PracticeArt() {
  return (
    <>
      <g data-art-orbit>
        <circle cx="340" cy="260" r="166" className="journey-art__orbit" />
        <path
          d="M340 94A166 166 0 0 1 489 187"
          className="journey-art__line journey-art__line--strong"
          pathLength={1}
          data-art-line
        />
        <path
          d="M505 279A166 166 0 0 1 355 425"
          className="journey-art__line journey-art__line--strong"
          pathLength={1}
          data-art-line
        />
        <path
          d="M213 367A166 166 0 0 1 193 183"
          className="journey-art__line journey-art__line--strong"
          pathLength={1}
          data-art-line
        />
        <path d="M482 159L490 187L461 180" className="journey-art__line journey-art__line--strong" />
        <path d="M381 409L355 425L352 394" className="journey-art__line journey-art__line--strong" />
        <path d="M183 209L193 183L218 200" className="journey-art__line journey-art__line--strong" />
      </g>

      <g data-art-panel>
        <path d="M340 168L422 215V307L340 354L258 307V215Z" className="journey-art__plane journey-art__plane--active" />
        <path
          d="M340 168V260M258 215L340 260L422 215M340 260V354"
          className="journey-art__line"
          pathLength={1}
          data-art-line
        />
        <path
          d="M305 268L329 292L378 238"
          className="journey-art__line journey-art__line--strong"
          pathLength={1}
          data-art-line
        />
      </g>

      {[
        { x: 340, y: 94 },
        { x: 505, y: 279 },
        { x: 213, y: 367 },
      ].map((node) => (
        <g key={`${node.x}-${node.y}`} data-art-panel>
          <circle cx={node.x} cy={node.y} r="18" className="journey-art__node-shell" />
          <circle cx={node.x} cy={node.y} r="6" className="journey-art__node" data-art-node />
        </g>
      ))}
    </>
  );
}

function TransitionArt() {
  return (
    <>
      <g data-art-panel>
        <path d="M94 126H318L354 162V396H94Z" className="journey-art__plane" />
        <path d="M318 126V162H354" className="journey-art__line" pathLength={1} data-art-line />
        <path d="M132 205H282M132 243H314M132 281H264" className="journey-art__line" pathLength={1} data-art-line />
        <circle cx="145" cy="342" r="19" className="journey-art__node-shell" />
        <path
          d="M136 342L143 349L156 334"
          className="journey-art__line journey-art__line--strong"
          pathLength={1}
          data-art-line
        />
        <circle cx="209" cy="342" r="19" className="journey-art__node-shell" />
        <path
          d="M200 342L207 349L220 334"
          className="journey-art__line journey-art__line--strong"
          pathLength={1}
          data-art-line
        />
        <circle cx="273" cy="342" r="19" className="journey-art__node-shell" />
        <path
          d="M264 342L271 349L284 334"
          className="journey-art__line journey-art__line--strong"
          pathLength={1}
          data-art-line
        />
      </g>

      <path
        d="M354 260H484"
        className="journey-art__line journey-art__line--strong"
        pathLength={1}
        data-art-line
      />
      <path
        d="M456 236L484 260L456 284"
        className="journey-art__line journey-art__line--strong"
        pathLength={1}
        data-art-line
      />

      <g data-art-orbit>
        <circle cx="526" cy="260" r="108" className="journey-art__orbit" />
        <circle cx="526" cy="260" r="73" className="journey-art__orbit journey-art__orbit--inner" />
        <path
          d="M526 152A108 108 0 0 1 634 260"
          className="journey-art__line journey-art__line--signal"
          pathLength={1}
          data-art-line
        />
      </g>
      <g data-art-panel>
        <circle cx="526" cy="260" r="42" className="journey-art__plane journey-art__plane--active" />
        <path
          d="M505 261L520 276L550 241"
          className="journey-art__line journey-art__line--strong"
          pathLength={1}
          data-art-line
        />
      </g>
      <circle cx="634" cy="260" r="7" className="journey-art__node" data-art-node />
    </>
  );
}

export function JourneyStageArt({ stageId, label }: JourneyStageArtProps) {
  const artId = `journey-art-${stageId}`;

  return (
    <svg
      className={`journey-art journey-art--${stageId}`}
      viewBox="0 0 680 520"
      role="img"
      aria-label={label}
      focusable="false"
      data-route-art
    >
      <ArtDefs id={artId} />
      <ArtGround id={artId} />
      {stageId === "assess" && <AssessArt id={artId} />}
      {stageId === "choose" && <ChooseArt />}
      {stageId === "route" && <RouteArt />}
      {stageId === "practice" && <PracticeArt />}
      {stageId === "transition" && <TransitionArt />}
    </svg>
  );
}
