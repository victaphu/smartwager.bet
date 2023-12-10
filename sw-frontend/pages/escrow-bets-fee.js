import Testimonial from "@/components/common/Testimonial";
import Banner from "@/components/escrowBetsFee/Banner";
import EscrowBets from "@/components/escrowBetsFee/EscrowBets";
import FaqSection from "@/components/escrowBetsFee/FaqSection";

export default function EscrowBetsFee() {
  return (
    <>
      {/* Banner section */}
      <Banner />

      {/* Escrow Bets section */}
      <EscrowBets />

      {/* Faq Section section */}
      <FaqSection />

      {/* Testimonial section */}
      <Testimonial />
    </>
  );
}
