"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Facet } from "./Facets";

import { cn, formatString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocale } from "@/hooks/useLocale";
import { Badge } from "@/components/ui/badge";

interface Props {
  defaultValue: string[];
  facet: Facet;
  onSelectAction: (value: string | undefined) => void;
}

export function SelectAutoComplete({
  defaultValue,
  facet,
  onSelectAction,
}: Props) {
  const { translateDict, translations } = useLocale();
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState(defaultValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {values.length > 0
            ? translateDict(
              facet.items.find((item) => item.id === values[0])?.title,
            )
            : formatString(translations.search.facets.select, facet.title)}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder={formatString(
              translations.search.facets.search,
              facet.title,
            )}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              {formatString(translations.search.facets.notFound, facet.title)}
            </CommandEmpty>
            <CommandGroup>
              {facet.items
                .sort(function(a, b) {
                  {
                    /* if (a.title < b.title) { */
                  }
                  if (a.count < b.count) {
                    return 1;
                  }
                  {
                    /* if (a.title > b.title) { */
                  }
                  if (a.count > b.count) {
                    return -1;
                  }
                  return 0;
                })
                .map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    keywords={[translateDict(item.title), item.id]}
                    onSelect={(currentValue) => {
                      if (values.find((value) => value === currentValue)) {
                        setValues(
                          values.filter((value) => value !== currentValue),
                        );
                      } else {
                        setValues([...values, currentValue]);
                      }
                      onSelectAction(currentValue);

                      setOpen(false);
                    }}
                  >
                    <Badge>{item.count}</Badge>
                    {translateDict(item.title)}
                    <Check
                      className={cn(
                        "ml-auto",
                        values.find((value) => value === item.id)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
