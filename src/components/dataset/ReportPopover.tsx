import { FlagIcon } from "lucide-react";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocale } from "@/hooks/useLocale";

interface Props {
  supportEmail?: string;
}

function clampString(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + "...";
}

export default function ReportPopover({ supportEmail }: Props) {
  const { translations, theme } = useLocale();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex w-fit items-center gap-2 group transition-all duration-200 hover:bg-secondary cursor-pointer rounded-lg p-1">
          <div className="bg-red-500 text-white p-1.5 rounded-xl w-fit group-hover:bg-red-500/80 transition-all duration-200">
            <FlagIcon size={24} />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] rounded-2xl flex flex-col gap-4">
        <div className="text-xl font-semibold flex gap-3 items-center">
          <div className="bg-red-500 text-white p-1.5 rounded-xl w-fit group-hover:bg-black/80 transition-all duration-200">
            <FlagIcon size={20} />
          </div>
          <h2>{translations.dataset.report.title}</h2>
        </div>

        <div className="text-sm text-muted-foreground">
          {translations.dataset.report.description}{" "}
          <Link
            href={`mailto:${supportEmail || theme.config.support.email}`}
            className="text-blue-500 hover:underline"
          >
            {supportEmail || theme.config.support.email}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
