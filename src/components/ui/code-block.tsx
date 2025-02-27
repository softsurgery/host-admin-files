import React, { useState } from "react";
import { cn } from "@/lib/utils";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useTheme } from "./theme-provider";
import { Clipboard, Check, Play } from "lucide-react"; // Icons for copy feedback
import { Button } from "./button";

export interface CodeBlockProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  language?: string;
  readOnly?: boolean; 
  onRun?: ()=>void;
}

const CodeBlock = React.forwardRef<HTMLTextAreaElement, CodeBlockProps>(
  ({ className, value, ...props }, ref) => {
    const { theme } = useTheme();
    const darkMode = theme === "dark";
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      if (value) {
        await navigator.clipboard.writeText(value.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    return (
      <div className="border px-2 pt-2">
        
        <div
          className={cn(
            "relative flex min-h-[80px] w-full border-input px-3 py-2 text-sm rounded-sm",
            className
          )}
          style={{ backgroundColor: darkMode ? "#333333" : "#ffffff" }}
        >
          <CodeEditor
            padding={0}
            data-color-mode={darkMode ? "dark" : "light"}
            style={{
              backgroundColor: darkMode ? "#333333" : "#ffffff",
              width: "100%",
              fontFamily: "ui-monospace,Menlo,monospace",
            }}
            ref={ref}
            value={value}
            readOnly={props.readOnly}
            {...props}
          />
        </div>
        <div className="flex justify-end">
        <Button variant={"ghost"} size={"icon"} onClick={handleCopy} className="m-1">
          {copied ? (
            <Check size={16} />
          ) : (
            <Clipboard size={16} />
          )}
        </Button>
        <Button variant={"ghost"} size={"icon"} onClick={props.onRun} className="m-1">
         <Play/>
        </Button>
        </div> 
      </div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
