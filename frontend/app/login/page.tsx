import { LoginFormCard } from "@/components/login";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-background py-6 sm:py-8 lg:py-9">
      <div className="mx-auto w-full max-w-screen-2xl px-6 sm:px-10 lg:px-14">
        <LoginFormCard />
      </div>
    </main>
  );
}
