type AvatarId = "tomato" | "blueberry" | "watermelon" | "grape";

export function CarrotMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 84 84"
      className="h-10 w-10 md:h-12 md:w-12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M51 17 58 12l8 13-10 2z"
        fill="#2f6a3d"
        transform="rotate(-18 58 19)"
      />
      <path
        d="M54 20 70 14l3 10-17 4z"
        fill="#2d7b44"
        transform="rotate(-8 63 19)"
      />
      <path
        d="M44 18c0-5 4-9 9-9 6 0 10 4 10 10 0 5-4 9-10 9-5 0-9-4-9-10Z"
        fill="#ef7a3f"
      />
      <path
        d="M33 29c0-6 5-11 11-11 7 0 12 5 12 12 0 6-5 11-12 11-6 0-11-5-11-12Z"
        fill="#f47d34"
      />
      <path
        d="M18 40c0-6 5-11 11-11 7 0 12 5 12 12 0 6-5 11-12 11-6 0-11-5-11-12Z"
        fill="#ffd9b2"
      />
      <path
        d="M8 53c0-5 4-9 9-9 6 0 10 4 10 10 0 5-4 9-10 9-5 0-9-4-9-10Z"
        fill="#ffd9b2"
      />
      <path
        d="M4 65c0-4 3-7 7-7 4 0 7 3 7 7s-3 7-7 7c-4 0-7-3-7-7Z"
        fill="#f47d34"
      />
    </svg>
  );
}

export function AvatarFace({
  avatar,
  selected,
}: {
  avatar: AvatarId;
  selected: boolean;
}) {
  const ringColor = selected ? "#ef7a3f" : "#f9ddb7";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 124 124"
      className="h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="62" cy="62" r="58" fill={ringColor} />
      {avatar === "tomato" ? <TomatoAvatar /> : null}
      {avatar === "blueberry" ? <BlueberryAvatar /> : null}
      {avatar === "watermelon" ? <WatermelonAvatar /> : null}
      {avatar === "grape" ? <GrapeAvatar /> : null}
    </svg>
  );
}

function TomatoAvatar() {
  return (
    <>
      <circle cx="61" cy="66" r="30" fill="#cb4a3c" />
      <path d="M38 94c8-7 16-11 24-11s16 4 24 11v7H38z" fill="#8f2a24" />
      <path
        d="M44 48c2-14 13-24 27-24s25 10 27 24c-8 0-13 2-17 6-5-3-11-5-19-5-7 0-13 2-18 6-4-3-9-5-17-7Z"
        fill="#e35145"
      />
      <path
        d="M46 31c7 1 11 5 13 12 2-5 6-10 14-13-1 8-4 13-8 16-7-1-13-6-19-15Z"
        fill="#3b6b3c"
      />
      <path d="M66 19c4 2 6 6 6 12" stroke="#3b6b3c" strokeWidth="5" strokeLinecap="round" />
      <EyePair />
      <Smile />
    </>
  );
}

function BlueberryAvatar() {
  return (
    <>
      <circle cx="61" cy="66" r="30" fill="#4d63bd" />
      <path d="M38 94c8-7 16-11 24-11s16 4 24 11v7H38z" fill="#324391" />
      <path d="M53 31c4 4 6 8 8 13 2-5 4-9 8-13 2 4 3 8 2 12H51c-1-4 0-8 2-12Z" fill="#4d63bd" />
      <path d="M49 35c3-3 7-5 12-5 5 0 9 2 12 5" stroke="#324391" strokeWidth="5" strokeLinecap="round" />
      <EyePair />
      <Smile />
    </>
  );
}

function WatermelonAvatar() {
  return (
    <>
      <path
        d="M24 55c9-16 25-25 38-25s29 9 38 25c-9 24-24 37-38 37S33 79 24 55Z"
        fill="#f36f74"
      />
      <path
        d="M27 59c9 18 22 27 35 27s26-9 35-27l5 2c-9 23-24 35-40 35S31 84 22 61Z"
        fill="#2f8f4b"
      />
      <path
        d="M26 58c8 17 22 26 36 26s28-9 36-26"
        stroke="#f7f2df"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <ellipse cx="44" cy="58" rx="2.4" ry="3.6" fill="#2f251e" transform="rotate(-18 44 58)" />
      <ellipse cx="53" cy="68" rx="2.4" ry="3.6" fill="#2f251e" transform="rotate(-8 53 68)" />
      <ellipse cx="80" cy="58" rx="2.4" ry="3.6" fill="#2f251e" transform="rotate(18 80 58)" />
      <ellipse cx="71" cy="68" rx="2.4" ry="3.6" fill="#2f251e" transform="rotate(8 71 68)" />
      <ellipse cx="62" cy="53" rx="2.2" ry="3.4" fill="#2f251e" />
      <EyePair />
      <Smile />
    </>
  );
}

function GrapeAvatar() {
  return (
    <>
      <ellipse cx="61" cy="66" rx="29" ry="33" fill="#8d49c9" />
      <path d="M38 95c8-7 16-11 23-11s16 4 25 11v6H38z" fill="#5d2c98" />
      <path d="M60 26c2-5 4-8 8-11 0 6-1 10-3 13" stroke="#3b6b3c" strokeWidth="5" strokeLinecap="round" />
      <circle cx="78" cy="42" r="8" fill="#b473ea" />
      <circle cx="88" cy="51" r="5" fill="#b473ea" />
      <EyePair />
      <Smile />
    </>
  );
}

function EyePair() {
  return (
    <>
      <ellipse cx="50" cy="65" rx="9" ry="11" fill="#fff7ec" />
      <ellipse cx="72" cy="65" rx="9" ry="11" fill="#fff7ec" />
      <circle cx="47" cy="67" r="4.5" fill="#55453b" />
      <circle cx="69" cy="67" r="4.5" fill="#55453b" />
      <circle cx="45" cy="65" r="1.5" fill="#fff" />
      <circle cx="67" cy="65" r="1.5" fill="#fff" />
    </>
  );
}

function Smile() {
  return (
    <path
      d="M53 81c5 3 10 3 16 0"
      stroke="#7e3f50"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
  );
}
