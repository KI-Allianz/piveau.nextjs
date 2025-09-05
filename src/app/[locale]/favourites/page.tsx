import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavouritesList from "./_components/FavouritesList";

export default async function FavouritesPage() {

  return (
    <div className="bg-background w-full max-w-[1920px] mx-auto shadow-[0_0_12px_rgba(0,0,0,0.17)]">
      <Header />
      <div className="px-10 pt-20 w-full max-w-7xl mx-auto">
        <FavouritesList />
      </div>
      <Footer />
    </div>
  );
}
