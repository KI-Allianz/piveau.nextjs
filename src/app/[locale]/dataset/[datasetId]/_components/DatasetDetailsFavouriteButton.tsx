"use client";

import React, {useMemo} from "react";
import {Star} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useLocale} from "@/hooks/useLocale";
import {Dataset} from "@/lib/utils";


interface Props {
  dataset: Dataset;
}

export default function DatasetDetailsFavouriteButton({ dataset }: Props) {
  const localStorageKey = `favourite_datasets`;
  const [rerender, setRerender] = React.useState(false);
  const { translations } = useLocale();


  const isFavourite = useMemo(() => {
    if (typeof window === "undefined") return false;
    const favourites = localStorage.getItem(localStorageKey);

    if (favourites) {
      const favouriteMap = JSON.parse(favourites) as Record<string, Dataset>;
      return favouriteMap[dataset.id] !== undefined;
    }
    return false;

  }, [dataset, rerender]);

  const toggle = () => {
    if (typeof window === "undefined") return;
    const favourites = localStorage.getItem(localStorageKey);
    let favouriteMap: Record<string, Dataset> = {};

    if (favourites) {
      favouriteMap = JSON.parse(favourites) as Record<string, Dataset>;
    }

    if (favouriteMap[dataset.id] !== undefined) {
      delete favouriteMap[dataset.id];
    } else {
      favouriteMap[dataset.id] = dataset;
    }

    localStorage.setItem(localStorageKey, JSON.stringify(favouriteMap));
    // Force re-render
    // window.location.reload();
    setRerender(!rerender);
  }

  return (
    <Button variant={isFavourite ? "default" : "secondary"} onClick={toggle} className="transition-all duration-300">
      {isFavourite ? (
        <Star fill={"green"} color="green" />
        ) : (
        <Star />
      )}
      <span>
        {isFavourite ? translations.dataset.favourite.remove : translations.dataset.favourite.add}
      </span>
    </Button>
  )
}