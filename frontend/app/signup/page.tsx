import { SignUpFormCard } from "@/components/signup/SignUpFormCard";

export default function SignUpPage() {
  return (
    <main className="min-h-screen w-full bg-background py-6 sm:py-8 lg:py-9">
      <div className="mx-auto w-full max-w-screen-2xl px-6 sm:px-10 lg:px-14">
        <SignUpFormCard />
      </div>
    </main>
  );
}
