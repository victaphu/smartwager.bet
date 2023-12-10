import Affilliate from "@/components/common/Affilliate";
import HowItWorks from "@/components/common/HowItWorks";
import AllSoccerBets from "@/components/soccerBetsOne/AllSoccerBets";
import Banner from "@/components/soccerBetsOne/Banner";
import FaqSection from "@/components/soccerBetsOne/FaqSection";

export default function SoccerBetsOne() {
  return (
    <>
      {/* Banner section */}
      <Banner />

      {/* All Soccer Bets section */}
      <AllSoccerBets />

      {/* How It Works section */}
      <HowItWorks />

      {/* Faq Section section */}
      <FaqSection />

      {/* Affilliate section */}
      <Affilliate />
    </>
  );
}
