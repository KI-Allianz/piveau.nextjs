import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useLocale } from "@/hooks/useLocale";
import { dataTypes } from "@/lib/content";
import {Dataset, UrlCollection} from "@/lib/utils";

interface Props {
  id: NonNullable<Dataset["distributions"]>[number]["id"];
  urls: UrlCollection;
}

export default function DatasetDetailsExportButton({ id, urls }: Props) {
  const { translations } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Menu />
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
                      href={urls.REPO + `datasets/${id}${type.value}`}
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
  );
}
