import { Hero } from "@/components/Hero";
import { TrackList } from "@/components/TrackList";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <TrackList />
      <Footer />
    </div>
  );
};

export default Index;