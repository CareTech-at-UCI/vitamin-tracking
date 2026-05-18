export type AvatarId = "tomato" | "blueberry" | "watermelon" | "grape";

const PROFILE_PICTURE_TO_AVATAR: Record<string, AvatarId> = {
  tomato: "tomato",
  blueberry: "blueberry",
  watermelon: "watermelon",
  grape: "grape",
  fox: "tomato",
  monkey: "blueberry",
  cat: "watermelon",
};

export const AVATAR_ASSETS: Record<AvatarId, string> = {
  tomato: "/assets/avatars/tomato.svg",
  blueberry: "/assets/avatars/blueberry.svg",
  watermelon: "/assets/avatars/watermelon.svg",
  grape: "/assets/avatars/grape.svg",
};

export function profilePictureToAvatarSrc(
  profilePicture: string | null | undefined,
): string {
  if (!profilePicture) return AVATAR_ASSETS.tomato;
  const avatar = PROFILE_PICTURE_TO_AVATAR[profilePicture] ?? "tomato";
  return AVATAR_ASSETS[avatar];
}
