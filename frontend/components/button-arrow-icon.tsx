import Image from "next/image";

type ButtonArrowIconProps = {
  className?: string;
  direction?: "left" | "right";
};

export function ButtonArrowIcon({
  className = "",
  direction = "right",
}: ButtonArrowIconProps) {
  return (
    <Image
      src={`/assets/avatars/arrow-${direction}.svg`}
      alt=""
      aria-hidden="true"
      width={28}
      height={28}
      className={className}
    />
  );
}
