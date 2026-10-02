"use client";

import dynamic from "next/dynamic";
import DatasetDetailsHeader from "./DatasetDetailsHeader";
import DatasetDetailsDistributions from "./DatasetDetailsDistributions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DatasetDetailsChatbot from "@/components/dataset/DatasetDetailsChatbot";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useMemo } from "react";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { ExternalLink, FileText } from "lucide-react";

// Fix Leaflet SSR crash by loading MapComponent only on the client
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

interface Props {
  id: string;
}

export default function DatasetDetails({ id }: Props) {
  const { locale, translations } = useLocale();
  const router = useRouter();
  const { data, error } = trpc.dataset.get.useQuery({ id });

  // Safe baseUrl calculation without crashing server-side pre-rendering
  const baseUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000";
  }, []);

  useEffect(() => {
    if (error?.data?.httpStatus === 401 || error?.data?.httpStatus === 403) {
      router.push(`/auth/signin?callbackUrl=/${locale}/dataset/${id}`);
    }
  }, [error, locale, id, router]);

  // Dynamically extract ANY DSW Project UUID (prefixed with urn:uuid: or dmp:)
  const dswUuid = useMemo(() => {
    if (!data) return null;
    const raw = JSON.stringify(data);

    // Matches any valid UUID that is preceded by "urn:uuid:" or "dmp:"
    const match = raw.match(/(?:urn:uuid:|dmp:)([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
    return match ? match[1] : null;
  }, [data]);

  return (
    <div className="px-10 pt-20 w-full max-w-7xl mx-auto flex flex-col gap-5">
      <DatasetDetailsHeader
        data={data}
        baseUrl={baseUrl}
        supportEmail={process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
        isAiModel={false}
      />

      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["distributions", "provenance", "assistant", "map"]}
      >
        {/* Governing Data Management Plan (DSW Provenance) */}
        {dswUuid && (
          <AccordionItem value={"provenance"} className="py-2">
            <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
              Governing Data Management Plan
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-3">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Planned via Data Stewardship Wizard (HammerHAI maDMP)</span>
                </div>
                <div className="text-sm text-muted-foreground flex flex-col gap-1">
                  <div>
                    <span className="font-semibold text-foreground">Project UUID: </span>
                    <code className="px-2 py-0.5 rounded bg-muted font-mono text-xs text-foreground">
                      {dswUuid}
                    </code>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Provenance link: </span>
                    <code className="text-xs font-mono">urn:uuid:{dswUuid}</code>
                  </div>
                </div>
                <div className="pt-2">
                  <a
                    href={`http://localhost:8088/wizard/projects/${dswUuid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <span>View Plan in Data Stewardship Wizard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value={"distributions"} className="py-2">
          <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
            {translations.dataset.distribution.title}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-2">
            <DatasetDetailsDistributions dataset={data} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={"assistant"} className="py-2">
          <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
            {translations.dataset.assistant.title}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-2">
            <DatasetDetailsChatbot
              dataset={data}
              backendUrl={
                process.env.NEXT_PUBLIC_CHATBOT_BACKEND_URL ||
                "/api/assistant"
              }
            />
          </AccordionContent>
        </AccordionItem>

        {data?.spatial && (
          <AccordionItem value={"map"} className="py-2">
            <AccordionTrigger className="py-4 text-2xl leading-6 hover:no-underline">
              {translations.dataset.map.title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-2">
              <MapComponent geoJsonData={data.spatial} />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}