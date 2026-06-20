import { Menu } from "lucide-react";
import Link from "next/link";

import { useLocale } from "@/hooks/useLocale";
import { dataTypes } from "@/lib/content";
import { Dataset, ObjectType } from "@/lib/utils";

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
import { fixThemeUrl } from "@/hooks/useTheme";

interface Props {
  id: NonNullable<Dataset["id"]>;
  type: ObjectType;
}

export default function ObjectDetailsExportButton({ id, type }: Props) {
  const { translations, locale, theme } = useLocale();

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
                {dataTypes.map((format) => (
                  <DropdownMenuItem key={format.value}>
                    <Link
                      href={fixThemeUrl(
                        `/${locale}/${type}/${id}/raw?format=${format.value}`,
                        theme,
                      )}
                      key={format.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full gap-4"
                    >
                      {format.label}
                      <DropdownMenuShortcut>
                        {format.value}
                      </DropdownMenuShortcut>
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
