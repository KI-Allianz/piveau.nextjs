import Image from "next/image";

export default function SupportSection() {
  return (
    <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">
      <div className="flex flex-col items-center bg-white dark:bg-black rounded-2xl px-10 shadow">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 flex flex-col gap-2">
            <h3 className="text-3xl font-bold  text-(--main-accent)">
              Project partners
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center items-center">
              {/* HLRS */}
              <div className="flex justify-center items-center">
                <Image
                  src="https://www.hammerhai.eu/wp-content/uploads/2025/09/hlrs-1024x376.png"
                  alt="Logo of HLRS (Höchstleistungsrechenzentrum Stuttgart). The abbreviation letters in black are accompanied only by a light blue computer cursor symbol (a vertical bar with horizontal lines extending from the top and bottom) in between the R and the S."
                  width={1024}
                  height={376}
                  className="h-20 w-auto object-contain"
                />
              </div>

              {/* LRZ */}
              <div className="flex justify-center items-center">
                <Image
                  src="https://www.hammerhai.eu/wp-content/uploads/2025/03/lrz_wortbild_e_rgb-1024x168.png"
                  alt="Logo of the LRZ. The abbreviation can be seen in white lowercase font in a light blue box on the left. To the right the wordmark can be seen spanning two lines: Leibniz Supercomputing Centre of the Bavarian Academy of Scences and Humanities"
                  width={1024}
                  height={168}
                  className="h-20 w-auto object-contain"
                />
              </div>

              {/* GWDG */}
              <div className="flex justify-center items-center">
                <Image
                  src="https://www.hammerhai.eu/wp-content/uploads/2025/03/logo-gwdg.png"
                  alt="Logo of the GWDG (Gesellschaft für wissenschaftliche Datenverarbeitung mbH Göttingen). The abbreviation is stacked on top of the written-out name. To the left of this wordmark five blue squares of different sizes can be seen touching each other with their rounded corners."
                  width={737}
                  height={218}
                  className="h-20 w-auto object-contain"
                />
              </div>

              {/* KIT */}
              <div className="flex justify-center items-center">
                <Image
                  src="https://www.hammerhai.eu/wp-content/uploads/2025/03/Logo_KIT.png"
                  alt='Logo of the KIT. Above the black wordmark "Karlsruher Institut für Technologie" the abbreviation "KIT" can be seen in black - with the left side of the K stylized with a fan-like formation of three green and one black triangles.'
                  width={1000}
                  height={500}
                  className="h-20 w-auto object-contain"
                />
              </div>

              {/* SICOS */}
              <div className="flex justify-center items-center">
                <Image
                  src="https://www.hammerhai.eu/wp-content/uploads/2025/03/Sicos_Logo_P306_grau.png"
                  alt="Logo of SICOS. To the left of the gray wordmark a light blue rhombus of a mobius strip can be seen."
                  width={1000}
                  height={256}
                  className="h-20 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 flex flex-col gap-5">
            <h3 className="text-3xl font-bold text-(--main-accent)">Funding</h3>

            {/* Description Text */}
            <div className="md:flex md:space-x-8 mb-10">
              <div className="md:w-1/3">
                <p className="text-sm md:text-base">
                  This project has received funding from the European High
                  Performance Computing Joint Undertaking under grant agreement
                  No. 101234027.
                </p>
              </div>

              <div className="md:w-2/3 mt-4 md:mt-0">
                <p className="text-sm md:text-base">
                  This project is co-funded by the European Commission, the
                  German Federal Ministry of Research, Technology and Space
                  (BMFTR), the Baden-Württemberg Ministry of Science, Research
                  and the Arts, the Bavarian State Ministry of Science and the
                  Arts, and the Lower Saxony Ministry of Science and Culture.
                </p>
              </div>
            </div>

            {/* Logos — Desktop */}
            <div className="hidden md:flex flex-wrap gap-3 justify-items-center items-center">
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/06/EN-Co-Funded-by-the-EU_POS-1024x215.png"
                alt="European Union Co-Funded by the EU logo"
                width={1024}
                height={215}
                className="h-7 w-auto object-contain"
              />
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/06/EuroHPC_JU_Logo.png"
                alt="EuroHPC JU logo"
                width={500}
                height={300}
                className="h-10 w-auto object-contain"
              />
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/05/BMFTR_de_v1__Web_farbig-scaled.png"
                alt="Logo of the German Federal Ministry of Research, Technology and Space (BMFTR). Features the German eagle, black-red-yellow stripe, and ministry name."
                width={2560}
                height={1324}
                className="h-10 w-auto object-contain"
              />
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/06/BaWue_Logo_XL_rgb_pos-1024x250.png"
                alt="Logo of the Baden-Württemberg Ministry of Science, Research and the Arts"
                width={1024}
                height={250}
                className="h-7 w-auto object-contain"
              />
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/06/StMWK_e_16zu9-scaled.png"
                alt="Logo of the Bavarian State Ministry of Science and the Arts"
                width={2560}
                height={1440}
                className="h-12 w-auto object-contain"
              />
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/06/MWK-Wappen-CMYK_1200-Pixel.jpg"
                alt="Logo of the Lower Saxony Ministry of Science and Culture"
                width={1200}
                height={200}
                className="h-8 w-auto object-contain"
              />
            </div>

            {/* Logos — Mobile */}
            <div className="md:hidden flex flex-wrap justify-center items-center gap-6 mt-8">
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/06/EN-Co-Funded-by-the-EU_POS-1024x215.png"
                alt="European Union Co-Funded by the EU logo"
                width={1024}
                height={215}
                className="h-14 w-auto object-contain"
              />
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/06/EuroHPC_JU_Logo.png"
                alt="EuroHPC JU logo"
                width={384}
                height={167}
                className="h-14 w-auto object-contain"
              />
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/05/BMFTR_de_v1__Web_farbig-scaled.png"
                alt="German Federal Ministry of Research, Technology and Space (BMFTR)"
                width={2560}
                height={1324}
                className="h-14 w-auto object-contain"
              />
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/06/BaWue_Logo_XL_rgb_pos-1024x250.png"
                alt="Baden-Württemberg Ministry of Science, Research and the Arts"
                width={1024}
                height={250}
                className="h-14 w-auto object-contain"
              />
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/06/StMWK_e_16zu9-scaled.png"
                alt="Bavarian State Ministry of Science and the Arts"
                width={2560}
                height={1440}
                className="h-14 w-auto object-contain"
              />
              <Image
                src="https://www.hammerhai.eu/wp-content/uploads/2025/06/MWK-Wappen-CMYK_1200-Pixel.jpg"
                alt="Lower Saxony Ministry of Science and Culture"
                width={1200}
                height={200}
                className="h-14 w-auto object-contain"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
