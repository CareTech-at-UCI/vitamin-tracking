import Image from "next/image";

type AvatarId = "tomato" | "blueberry" | "watermelon" | "grape";

const AVATAR_ASSETS: Record<AvatarId, string> = {
  tomato: "/assets/avatars/tomato.svg",
  blueberry: "/assets/avatars/blueberry.svg",
  watermelon: "/assets/avatars/watermelon.svg",
  grape: "/assets/avatars/grape.svg",
};

export function CarrotMark() {
  return (
    <Image
      src="/assets/avatars/carrot.svg"
      alt=""
      aria-hidden="true"
      width={48}
      height={48}
      className="h-10 w-10 md:h-12 md:w-12"
    />
  );
}

export function AvatarFace({
  avatar,
  selected,
}: {
  avatar: AvatarId;
  selected: boolean;
}) {
  return (
    <span
      className={`flex h-20 w-20 items-center justify-center rounded-full md:h-24 md:w-24 lg:h-28 lg:w-28 ${
        selected ? "bg-[#ef7a3f]" : "bg-[#f9ddb7]"
      }`}
    >
      <Image
        src={AVATAR_ASSETS[avatar]}
        alt=""
        aria-hidden="true"
        width={112}
        height={112}
        className="h-full w-full"
      />
    </span>
  );
}
