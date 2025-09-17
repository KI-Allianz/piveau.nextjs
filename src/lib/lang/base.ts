import {facetTranslations} from "@/lib/lang/facets";
import {NavItemId} from "@/components/Header";
import {SortMode} from "@/lib/utils";


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
    },
    page: string;
    sort: Record<SortMode, string>;
  },
  navigation: {
    navTitles: Record<NavItemId, string>;
    back: string;
  }
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
      processing: string;
      answer: string;
    },
    favourite: {
      add: string;
      remove: string;
    },
    categories: string
    keywords: string;
    description: string;
    linkedData: string;
    aiModel: string;
    lastModified: string;
    issuedOn: string;
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
  },
  expand: {
    more: string;
    less: string;
  },
  facets: facetTranslations;
  open: string;
  languages: string;
}