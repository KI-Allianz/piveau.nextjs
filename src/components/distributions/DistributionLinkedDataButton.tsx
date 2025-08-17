"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link";
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import {useLocale} from "@/hooks/useLocale";
import {dataTypes} from "@/lib/content";


interface Props {
  id: NonNullable<StandardSchemaV1.InferOutput<typeof schemaDataset>["distributions"]>[number]["id"]
}

export function DistributionLinkedDataButton({id}: Props) {
  const { translations } = useLocale()
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {translations.dataset.linkedData}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="right" align="start">
        <Command>
          <CommandInput placeholder={translations.dataset.distribution.placeholder} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>{translations.download.noDownloads}</CommandEmpty>
            <CommandGroup>
              {dataTypes.map((status) => (
                <Link
                  href={`https://piveau.hlrs.de/hub/repo/distributions/${id}${status.value}`}
                  key={status.value}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CommandItem
                    value={status.value}
                    keywords={[status.label, status.value]}
                  >
                    {status.label}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
