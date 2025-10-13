import Image from "next/image";


export default function SupportSection() {
  return (
    <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">
      <div className="flex flex-col items-center bg-white dark:bg-black rounded-2xl px-10 pb-10 pt-16">
        <div className="max-w-2xl flex flex-col gap-5">
          <h2 className="text-4xl font-bold mb-2">Ein Ergebnis des Projektes "Datenplattform der KI-Allianz Baden-Württemberg"</h2>
          <p className="text-lg">
            Die KI-Allianz Baden-Württemberg eG und die verbundenen Projekte
            sind eine Initiative, die darauf abzielt, die Entwicklung und
            Anwendung von Künstlicher Intelligenz (KI) zu fördern. Die
            Maßnahmen sollen dazu beitragen, Baden-Württemberg zu einem
            Hotspot der KI-Entwicklung und -Anwendung zu machen, bestehende
            Initiativen zu verbinden und die digitale Transformation
            überregional vernetzt voranzutreiben.
          </p>
        </div>

        <div className="max-w-sm">
          <Image
            loading="lazy"
            decoding="async"
            width="800"
            height="398"
            src="/logo_bw-gefoerdert.svg"
            className="attachment-large size-large wp-image-12052 dark:invert"
            alt="LOGO Baden-Württemberg, Ministerium für Arbeit und Tourismus"
          />
        </div>
      </div>
    </div>
  )
}