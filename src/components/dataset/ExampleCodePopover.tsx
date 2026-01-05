import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import {CodeExampleType, codeExampleTypesNames, getCodeExample, getInstallationExample} from "@/lib/code/examples";
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

interface Props {
  url: string;
  customParser?: string;
}

export default function ExampleCodePopover({ url, customParser }: Props) {
  const [exampleType, setExampleType] = React.useState<CodeExampleType>(CodeExampleType.CUSTOM_PARSING);
  const exampleCode = useMemo(() => getCodeExample(exampleType, url), [url, exampleType]);
  const installationCode = useMemo(
    () => getInstallationExample(customParser, exampleType),
    [customParser, exampleType]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" className="rounded-2xl">
          <Code />
          Code
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] rounded-2xl flex flex-col gap-4">
        <div>
          <Label className="text-muted-foreground mb-1 ml-1">Parsers</Label>
          <Select
            defaultValue={exampleType}
            onValueChange={(value) => setExampleType(value as CodeExampleType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a parser" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Parsers</SelectLabel>
                {Object.values(CodeExampleType).map((type) => (
                  <SelectItem value={type}>
                    {codeExampleTypesNames[type]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <CodeBlock code={installationCode} title={"Installation"} />

        <CodeBlock
          code={exampleCode}
          docUrl={"https://github.com/maxbrzr/dcat-ap-hub"}
          title={"Example"}
        />
      </PopoverContent>
    </Popover>
  );
}
