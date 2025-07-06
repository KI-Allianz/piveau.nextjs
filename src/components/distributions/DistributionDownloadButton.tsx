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
import {SquareArrowOutUpRight} from "lucide-react";

interface Props {
  access_urls: NonNullable<StandardSchemaV1.InferOutput<typeof schemaDataset>["distributions"]>[number]["access_url"]
  download_urls: NonNullable<StandardSchemaV1.InferOutput<typeof schemaDataset>["distributions"]>[number]["download_url"]
}

export function DistributionDownloadButton({access_urls, download_urls}: Props) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          Download
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="right" align="start">
        <Command>
          <CommandInput placeholder="Search urls..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No downloads found.</CommandEmpty>
            <CommandGroup className="gap-1">
              {access_urls?.filter((url) => url.toLowerCase().includes(search.toLowerCase())).map((url) => (
                <Link
                  href={url}
                  key={"au" + url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CommandItem
                    value={"au" + url}
                    className="flex flex-col gap-1 items-start"
                  >
                    <div className="flex gap-2 items-center">
                      <SquareArrowOutUpRight />
                      <h3 className="font-semibold">Access Url</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{url}</p>
                  </CommandItem>
                </Link>
              ))}
              {download_urls?.filter((url) => url.toLowerCase().includes(search.toLowerCase())).map((url) => (
                <Link
                  href={url}
                  key={"du" + url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CommandItem
                    value={"du" + url}
                    className="flex flex-col gap-1 items-start"
                  >
                    <div className="flex gap-2 items-center">
                      <SquareArrowOutUpRight />
                      <h3 className="font-semibold">Download Url</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{url}</p>
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
