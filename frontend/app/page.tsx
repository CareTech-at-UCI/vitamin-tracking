import { HomeHero, HomeInfoSection } from "@/components/home";

export default function Home() {
  return (    
    <main className="w-full bg-background text-foreground">
      <HomeHero />
      <HomeInfoSection />
    </main>
  )
}