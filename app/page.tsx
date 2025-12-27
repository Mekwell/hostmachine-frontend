import Header from "@/components/Header";

export default async function Home() {
  const games = await getGames();
  const gamesList = Array.isArray(games) ? games : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <SectionDivider />
        <GameCarousel games={gamesList} />
        <SectionDivider />
        <MinecraftPromo />
        <SectionDivider />
        <OfferGrid />
        <SectionDivider />
        <HostingComparison />
        <SectionDivider />
        <FullGameGrid games={gamesList} />
      </main>

      <footer className="py-16 border-t border-white/5 bg-black/40">
          <div className="container-main text-center">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-gray-600">
                  © 2025 Host Machine • Australian Gaming Infrastructure
              </p>
          </div>
      </footer>
    </div>
  );
}