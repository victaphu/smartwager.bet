import AllTournaments from "@/components/tournaments/AllTournaments";
import Banner from "@/components/tournaments/Banner";
import HowItWorks from "@/components/tournaments/HowItWorks";

export default function Tournaments() {
  return (
    <>
      {/* Banner section */}
      <Banner />

      {/* How It Works section */}
      <HowItWorks />

      {/* All Tournaments section */}
      <AllTournaments />
    </>
  );
}
