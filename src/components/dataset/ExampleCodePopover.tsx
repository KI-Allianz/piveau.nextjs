import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {BookOpenText, Code, Copy} from "lucide-react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {customParsingExample, formatExample} from "@/lib/code/examples";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface Props {
  url: string
}

export default function ExampleCodePopover({ url }: Props) {

  const exampleCode = formatExample(customParsingExample, url);

  const copyExampleCode = () => {
    navigator.clipboard.writeText(exampleCode)
      .then(() => {
        console.log("Example code copied to clipboard");
      })
      .catch(err => {
        console.error("Failed to copy example code: ", err);
      });
  }

  const openDocumentation = () => {
    const docUrl = "https://github.com/maxbrzr/dcat-ap-hub";
    window.open(docUrl, "_blank");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" className="rounded-2xl">
          <Code />
          Code
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px]">
        <div className="relative mt-4">
          <SyntaxHighlighter language="python" style={docco} customStyle={{
            borderRadius: "0.5rem",
            background: "#eeeeee",
            padding: "1rem",
          }}>
            {exampleCode}
          </SyntaxHighlighter>

          <div className="absolute top-0 right-0 m-2" onFocusCapture={e => e.stopPropagation()}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={openDocumentation}>
                  <BookOpenText />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Documentation</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={copyExampleCode}>
                  <Copy />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Code</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}