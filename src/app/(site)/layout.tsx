import { MountainCinema } from "@/components/scenic/mountain-cinema";
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
      <MountainCinema />
      <div>
        {children}
        <SiteFooter />
      </div>
    </>
  );
}
