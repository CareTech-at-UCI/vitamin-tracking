type Props = {
  label: string;
};

export default function MealEmptyPlaceholder({ label }: Props) {
  return (
    <div
      className="flex size-36 shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-secondary/25 bg-secondary/6 px-2 text-center sm:size-40"
      role="status"
      aria-label={`No foods logged for ${label}`}
    >
      <p className="font-secondary text-[11px] font-medium leading-snug text-secondary/55 sm:text-xs">
        Nothing logged
      </p>
    </div>
  );
}
