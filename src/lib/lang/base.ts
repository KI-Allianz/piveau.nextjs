

export type translations = {
  search: {
    facets: {
      title: string;
      description: string;
      select: string,
      search: string;
      hide: string,
      show: string,
      ignore: string,
      notFound: string;
    },
    placeholder: {
      datasets: string;
      catalogues: string;
    },
    tabs: {
      datasets: string;
      dataServices: string;
      aiModels: string;
    }
  },
  dataset: {
    distribution: {
      title: string;
      license: string;
      licensingAssistant: string
      placeholder: string;
    },
    map: {
      title: string;
    },
    assistant: {
      title: string;
      header: string;
      placeholder: string;
      ask: string;
    }
    categories: string
    keywords: string;
    description: string;
    linkedData: string;
    aiModel: string;
  },
  catalogue: {
    title: string,
    description: string,
    languages: string,
    created: string,
    updated: string,
    metadata: string,
  },
  download: {
    download: string;
    noDownloads: string;
  }
  open: string;
  languages: string;
}