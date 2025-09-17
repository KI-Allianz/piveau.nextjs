import { translations } from "@/lib/lang/base";
import {SortMode} from "@/components/facets/SortButton";
import {NavItemId} from "@/components/Header";

export const de: translations = {
  search: {
    facets: {
      title: "Facetten",
      description:
        "Filtere Ergebnisse nach Facetten wie Kategorie, Katalog und mehr.",
      select: "Wähle {0}...",
      search: "Suche {0}...",
      hide: "Ausblenden",
      show: "Anzeigen",
      ignore: "Ignorieren",
      notFound: "Keine {0} gefunden.",
    },
    placeholder: {
      datasets: "Suche nach Datensätzen, Datenservices und KI-Modellen...",
      catalogues: "Suche nach Kataloge...",
    },
    tabs: {
      datasets: "Daten",
      dataServices: "Schnittstellen",
      aiModels: "Modelle",
    },
    page: "Seite",
    sort: {
      [SortMode.LAST_MODIFIED]: "Zuletzt geändert",
      [SortMode.RELEVANCE]: "Relevanz",
      [SortMode.NAME_ASC]: "Name Aufsteigend",
      [SortMode.NAME_DESC]: "Name Absteigend",
      [SortMode.LAST_ISSUED]: "Zuletzt veröffentlicht",
    },
  },
  header: {
    navTitles: {
      [NavItemId.DATASETS]: "Daten",
      [NavItemId.CATALOGUES]: "Kataloge",
      [NavItemId.FAVOURITES]: "Favoriten",
    }
  },
  dataset: {
    distribution: {
      title: "Verfügbare Daten",
      license: "Lizenz",
      licensingAssistant: "Lizenzierungsassistent",
      placeholder: "Suche urls...",
    },
    map: {
      title: "Karte",
    },
    assistant: {
      title: "KI Datenassistent",
      header: "Frage zu diesem Datensatz",
      placeholder: "z.B. Was ist das Hauptthema dieses Datensatzes?",
      ask: "Ask",
    },
    keywords: "Keywords",
    categories: "Kategorien",
    description: "Beschreibung",
    linkedData: "Verknüpfte Daten",
    aiModel: "KI Modell",
    lastModified: "Zuletzt geändert",
    issuedOn: "Ausgestellt am",
  },
  catalogue: {
    title: "Titel",
    description: "Beschreibung",
    languages: "Sprachen",
    created: "Erstellt",
    updated: "Aktualisiert",
    metadata: "Katalog-Metadaten als verknüpfte Daten",
  },
  download: {
    download: "Herunterladen",
    noDownloads: "Keine Downloads gefunden.",
  },
  expand: {
    more: "Mehr anzeigen",
    less: "Weniger anzeigen",
  },
  facets: {
    dataScope: "Datensatzbereich",
    is_hvd: "HVD",
    hvdCategory: "HVD Kategorie",
    country: "Land",
    catalog: "Katalog",
    superCatalog: "Superkatalog",
    categories: "Kategorien",
    publisher: "Herausgeber",
    keywords: "Schlagwörter",
    scoring: "Bewertung",
    format: "Format",
    license: "Lizenz",
    subject: "Thema",
  },
  open: "Öffnen",
  languages: "Sprachen",
};
