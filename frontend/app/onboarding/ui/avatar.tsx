import { AvatarFace } from "@/app/onboarding/ui/art";

type AvatarOption = {
  id: "tomato" | "blueberry" | "watermelon" | "grape";
  label: string;
};

type OnboardingStepAvatarProps = {
  selectedAvatar: AvatarOption["id"] | "";
  avatars: readonly AvatarOption[];
  onAvatarChange: (avatar: AvatarOption["id"]) => void;
};

export function OnboardingStepAvatar({
  selectedAvatar,
  avatars,
  onAvatarChange,
}: OnboardingStepAvatarProps) {
  return (
    <section className="flex flex-col gap-9">
      <div>
        <h1 className="text-4xl leading-tight font-semibold tracking-[-0.04em] text-[#3b6b3c] md:text-5xl">
          Choose your avatar
        </h1>
      </div>
      <div className="flex flex-wrap gap-5">
        {avatars.map((avatar) => {
          const isSelected = avatar.id === selectedAvatar;

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onAvatarChange(avatar.id)}
              className={`group flex flex-col items-center gap-3 rounded-[30px] border px-4 py-4 transition-transform hover:-translate-y-1 ${
                isSelected
                  ? "border-[#ef7a3f] bg-white/80 shadow-[0_14px_40px_rgba(239,122,63,0.16)]"
                  : "border-transparent bg-transparent"
              }`}
              aria-pressed={isSelected}
            >
              <AvatarFace avatar={avatar.id} selected={isSelected} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
