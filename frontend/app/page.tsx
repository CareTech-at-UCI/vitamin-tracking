import { HomeHero, HomeInfoSection, HomeMobile } from "@/components/home";

export default function Home() {
  return (
    <main className="w-full bg-background text-foreground">
      <HomeMobile />
      <HomeHero />
      <HomeInfoSection />
    </main>
  );
}