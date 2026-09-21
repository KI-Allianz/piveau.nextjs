import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supportedLocales } from "@/lib/lang";
import CatalogueDetails from "@/components/catalog/CatalogueDetails";

interface Props {
  params: Promise<{ id: string; locale: supportedLocales }>;
}

export default async function CatalogPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <CatalogueDetails id={id} />
      <Footer />
    </div>
  );
}
