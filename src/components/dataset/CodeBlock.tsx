import SyntaxHighlighter from "react-syntax-highlighter";
import {docco, dracula} from "react-syntax-highlighter/dist/esm/styles/hljs";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {BookOpenText, Copy} from "lucide-react";
import React from "react";
import {useTheme} from "next-themes";

interface Props {
  code: string;
  title?: string;
  docUrl?: string;
}

export function CodeBlock({ code, title, docUrl }: Props) {
  const { theme } = useTheme();

  const copyExampleCode = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        console.log("Example code copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy example code: ", err);
      });
  };

  const openDocumentation = () => {
    window.open(docUrl, "_blank");
  };

  return (
    <div className="relative">
      <SyntaxHighlighter
        language="python"
        style={theme == "dark" ? dracula : docco}
        customStyle={{
          borderRadius: "0.5rem",
          background: theme == "dark" ? "#111111" : "#EEE",
          padding: "1rem",
          paddingTop: title ? "3rem" : "1rem"
        }}
      >
        {code}
      </SyntaxHighlighter>

      <div
        className="absolute top-2 left-2 m-2 text-muted-foreground text-sm"
        onFocusCapture={(e) => e.stopPropagation()}
      >
        {title}
      </div>

      <div
        className="absolute top-0 right-0 m-2"
        onFocusCapture={(e) => e.stopPropagation()}
      >
        {docUrl && (
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
        )}

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
  )
}