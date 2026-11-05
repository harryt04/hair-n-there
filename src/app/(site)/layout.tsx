import { JourneyRoads } from "@/components/scenic/journey-roads";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <JourneyRoads>
        {children}
        <SiteFooter />
      </JourneyRoads>
    </>
  );
}
