
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Menu} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import {useLocale} from "@/hooks/useLocale";
import {dataTypes} from "@/lib/content";

interface Props {
  id: NonNullable<StandardSchemaV1.InferOutput<typeof schemaDataset>["distributions"]>[number]["id"]
}

export default function DatasetDetailsExportButton({ id }: Props) {
  const { translations } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Menu
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {translations.dataset.linkedData}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {dataTypes.map((type) => (
                  <DropdownMenuItem key={type.value}>
                    <Link
                      href={`https://piveau.hlrs.de/hub/repo/datasets/${id}${type.value}`}
                      key={type.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full gap-4"
                    >
                      {type.label}
                      <DropdownMenuShortcut>{type.value}</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}