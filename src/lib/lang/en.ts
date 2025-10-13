import {translations} from "@/lib/lang/base";
import {NavItemId} from "@/components/Header";
import {SortMode} from "@/lib/utils";


export const en: translations = {
  search: {
    facets: {
      title: 'Facets',
      description: 'Filter results by facets such as category, catalogue, and more.',
      select: "Select {0}...",
      search: "Select {0}...",
      hide: "Hide",
      show: "Show",
      ignore: "Ignore",
      notFound: "No {0} found."
    },
    placeholder: {
      datasets: 'Search datasets, data services, and AI models...',
      catalogues: 'Search catalogues...'
    },
    tabs: {
      datasets: 'Datasets',
      dataServices: 'Data Services',
      aiModels: 'AI Models'
    },
    page: "Page",
    sort: {
      [SortMode.LAST_MODIFIED]: "Last Modified",
      [SortMode.RELEVANCE]: "Relevance",
      [SortMode.NAME_ASC]: "Name Ascending",
      [SortMode.NAME_DESC]: "Name Descending",
      [SortMode.LAST_ISSUED]: "Last Issued",
    },
  },
  navigation: {
    navTitles: {
      [NavItemId.DATASETS]: "Datasets",
      [NavItemId.CATALOGUES]: "Catalogues",
      [NavItemId.FAVOURITES]: "Favourites",
    },
    back: "Back"
  },
  dataset: {
    distribution: {
      title: "Available Data",
      titleWeights: "Available Weights",
      license: "License",
      licensingAssistant: "Licensing Assistant",
      placeholder: "Search urls..."
    },
    map: {
      title: 'Map'
    },
    assistant: {
      title: "AI Data Assistant",
      header: "Ask about this dataset",
      placeholder: "E.g., What is the main topic of this dataset?",
      ask: "Ask",
      processing: "Processing...",
      answer: "Answer"
    },
    favourite: {
      add: "Add to Favourites",
      remove: "Remove from Favourites"
    },
    keywords: "Keywords",
    categories: "Categories",
    description: "Description",
    linkedData: "Linked Data",
    aiModel: "AI Model",
    lastModified: "Last Modified",
    issuedOn: "Issued On",
    daysOld: "days old",
  },
  catalogue: {
    title: "Title",
    description: "Description",
    languages: "Languages",
    created: "Created",
    updated: "Updated",
    metadata: "Catalogue Metadata as linked data",
  },
  download: {
    download: 'Download',
    noDownloads: 'No downloads found.'
  },
  expand: {
    more: "Show more",
    less: "Show less"
  },
  footer: {
    imprint: "Imprint",
    privacy: "Privacy",
  },
  facets: {
    dataScope: "Data Scope",
    is_hvd: "HVD",
    hvdCategory: "HVD Category",
    country: "Country",
    catalog: "Catalog",
    superCatalog: "Super Catalog",
    categories: "Categories",
    publisher: "Publisher",
    keywords: "Keywords",
    scoring: "Scoring",
    format: "Format",
    license: "License",
    subject: "Subject"
  },
  open: 'Open',
  languages: "Languages",
}