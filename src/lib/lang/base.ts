

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
      license: string;
      licensingAssistant: string
      linkedData: string;
      placeholder: string;
    }
  },
  download: {
    download: string;
    noDownloads: string;
  }
  open: string;
}