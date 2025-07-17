

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
    placeholder: string;
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
    categories: string
    keywords: string;
    description: string;
    linkedData: string;
  },
  download: {
    download: string;
    noDownloads: string;
  }
  open: string;
}