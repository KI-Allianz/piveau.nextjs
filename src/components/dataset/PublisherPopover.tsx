import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {Code, LinkIcon, Mail, MapPin, Phone, Users} from "lucide-react";
import {CodeExampleType, codeExampleTypesNames, getCodeExample, installationExample} from "@/lib/code/examples";
import React, {useMemo} from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {Label} from "@/components/ui/label";
import {CodeBlock} from "@/components/dataset/CodeBlock";
import {StandardSchemaV1} from "@standard-schema/spec";
import {schemaDataset} from "@piveau/sdk-core/model";
import Link from "next/link";

interface Props {
  dataset: StandardSchemaV1.InferOutput<typeof schemaDataset>;
}

export default function PublisherPopover({ dataset }: Props) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className="flex items-center gap-2 font-semibold group transition-all duration-200 hover:bg-accent/30 cursor-pointer rounded-lg p-1"
        >
          <div className="bg-black text-white p-1.5 rounded-xl w-fit group-hover:bg-black/80 transition-all duration-200">
            <Users size={18} />
          </div>
          {dataset.publisher?.name}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] rounded-2xl flex flex-col gap-4">
        <div className="text-xl font-semibold flex gap-4 items-center">
          <h2>
            {dataset.publisher?.name || "Publisher Information"}
          </h2>

          {dataset.publisher?.homepage && (
            <Link href={dataset.publisher?.homepage} >
              <LinkIcon className="hover:text-blue-600 cursor-pointer transition-all duration-200" />
            </Link>
          )}
          {dataset.publisher?.email && (
            <Link href={dataset.publisher?.email} >
              <Mail className="hover:text-blue-600 cursor-pointer transition-all duration-200" />
            </Link>
          )}
        </div>

        <div>
          {dataset.contact_point?.map((contact, index) => (
            <div key={index} className="flex flex-col gap-1 bg-card/50 rounded-lg px-4 py-2">
              <h4 className="">
                {contact.name || contact.organisation_name || "Contact"}
              </h4>

              {contact.email && (
                <Link href={contact.email} >
                  <p className="flex items-center gap-2 text-sm text-blue-600 hover:underline break-all">
                    <Mail size={15} />
                    {contact.email.replaceAll("mailto:", "")}
                  </p>
                </Link>
              )}

              {contact.url?.map((url) => (
                <Link href={url} >
                  <p className="flex items-center gap-2 text-sm text-blue-600 hover:underline break-all">
                    <LinkIcon size={15} />
                    {url}
                  </p>
                </Link>
              ))}

              {contact.telephone && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground break-all">
                  <Phone size={15} />
                  {contact.telephone}
                </p>
              )}

              {contact.address && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground break-all">
                  <MapPin size={15} />
                  {contact.address}
                </p>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
