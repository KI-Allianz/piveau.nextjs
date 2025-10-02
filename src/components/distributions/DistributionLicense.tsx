import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from "@/components/motion-primitives/morphing-dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, SquareArrowOutUpRight } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import {useLicenses} from "@/hooks/useLicenses";
import { Dataset } from "@/lib/utils";

interface Props {
  license: NonNullable<Dataset["distributions"]>[number]["license"];
}

export function DistributionLicense({ license }: Props) {
  const { translations } = useLocale();
  const { getLicense } = useLicenses();

  return (
    <MorphingDialog
      transition={{
        type: "spring",
        stiffness: 1500,
        damping: 100,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: "4px",
        }}
        className="border border-gray-200/60 bg-card"
      >
        <div className="flex items-center space-x-3 p-3">
          <div className="flex flex-col items-start justify-center space-y-0">
            <MorphingDialogTitle className="text-[10px] font-medium sm:text-xs flex gap-1">
              <Scale size={15} />
              {getLicense(license?.resource).label}
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="text-[10px] text-muted-foreground sm:text-xs">
              {getLicense(license?.resource).usageType}
            </MorphingDialogSubtitle>
          </div>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: "12px",
          }}
          className="relative h-auto w-[500px] border border-gray-100 bg-card"
        >
          <div className="relative p-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-medium text-muted-foreground sm:text-xs flex gap-1">
                <Scale size={15} />
                {translations.dataset.distribution.license}
              </span>
              <MorphingDialogTitle className="">
                {getLicense(license?.resource).label}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="font-light text-gray-400">
                {getLicense(license?.resource).usageType}
              </MorphingDialogSubtitle>
              <div className="mt-4 flex gap-2">
                <Link
                  href={license?.resource ?? "#"}
                  className="text-blue-500 hover:underline"
                >
                  <Button variant={"outline"}>
                    <SquareArrowOutUpRight />
                    {translations.open}
                  </Button>
                </Link>
                {(license as { la_url?: string }).la_url && (
                  <Link
                    href={(license as { la_url: string })?.la_url ?? "#"}
                    className="text-blue-500 hover:underline"
                  >
                    <Button variant={"outline"}>
                      <SquareArrowOutUpRight />
                      {translations.dataset.distribution.licensingAssistant}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <MorphingDialogClose className="text-zinc-500" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
