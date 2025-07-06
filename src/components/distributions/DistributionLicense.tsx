import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/motion-primitives/morphing-dialog';
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Scale, SquareArrowOutUpRight} from "lucide-react";

interface Props {
  license: NonNullable<StandardSchemaV1.InferOutput<typeof schemaDataset>["distributions"]>[number]["license"]
}

export function DistributionLicense({license}: Props) {
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
          borderRadius: '4px',
        }}
        className='border border-gray-200/60 bg-white'
      >
        <div className='flex items-center space-x-3 p-3'>
          <div className='flex flex-col items-start justify-center space-y-0'>
            <MorphingDialogTitle className='text-[10px] font-medium text-black sm:text-xs flex gap-1'>
              <Scale size={15} />
              License
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='text-[10px] text-gray-600 sm:text-xs'>
              {license?.label}
            </MorphingDialogSubtitle>
          </div>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: '12px',
          }}
          className='relative h-auto w-[500px] border border-gray-100 bg-white'
        >
          <div className='relative p-6'>
            <div className=''>
              <span className='text-[10px] font-medium text-muted-foreground sm:text-xs flex gap-1'>
                <Scale size={15} />
                License
              </span>
              <MorphingDialogTitle className='text-black'>
                {license?.label}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className='font-light text-gray-400'>
                {license?.description}
              </MorphingDialogSubtitle>
              <div className='mt-4 flex gap-2'>
                <Link
                  href={license?.resource ?? "#"}
                  className="text-blue-500 hover:underline"
                >
                  <Button variant={"outline"}>
                    <SquareArrowOutUpRight />
                    Open
                  </Button>
                </Link>
                <Link
                  href={(license as {la_url: string})?.la_url ?? "#"}
                  className="text-blue-500 hover:underline"
                >
                  <Button variant={"outline"}>
                    <SquareArrowOutUpRight />
                    Licensing Assistant
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <MorphingDialogClose className='text-zinc-500' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
