import {translations} from "@/lib/lang/base";


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
    placeholder: 'Search datasets, data services, and AI models...',
    tabs: {
      datasets: 'Datasets',
      dataServices: 'Data Services',
      aiModels: 'AI Models'
    }
  },
  dataset: {
    distribution: {
      title: "Distributions",
      license: "License",
      licensingAssistant: "Licensing Assistant",
      placeholder: "Search urls..."
    },
    map: {
      title: 'Map'
    },
    keywords: "Keywords",
    categories: "Categories",
    description: "Description",
    linkedData: "Linked Data",
  },
  download: {
    download: 'Download',
    noDownloads: 'No downloads found.'
  },
  open: 'Open'
}