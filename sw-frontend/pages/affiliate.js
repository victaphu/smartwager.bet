import AffiliatesDetails from "@/components/affiliate/AffiliatesDetails";
import Banner from "@/components/affiliate/Banner";
import Features from "@/components/affiliate/Features";
import HowItWork from "@/components/affiliate/HowItWork";
import Testimonial from "@/components/common/Testimonial";

export default function Affiliate() {
  return (
    <>
      {/* Banner section */}
      <Banner />

      {/* Affiliates Details section */}
      <AffiliatesDetails />

      {/* Features section */}
      <Features />

      {/* How It Work section */}
      <HowItWork />

      {/* Testimonial section */}
      <Testimonial />
    </>
  );
}
