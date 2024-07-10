import React, { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import copy from "@/assets/copy.svg";
import Image from "next/image";
import { TbClipboardCopy } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";

interface ShowCodeProps {
  code: string;
}

const ShowCode: React.FC<ShowCodeProps> = ({ code }) => {
  const [copy, setCopy] = useState(false);
  return (
    <div className="bg-gray-500 grid place-items-center h-full w-full">
      <div className="max-w-2x1 w-full h-full bg-[#3a404d] rounded-md  overflow-hidden">
        <div className="flex justify-between px-4 text-white text-[18px] font-bold text-xs items-center h-[50px]">
          <p className="">Example Code</p>
          {copy ? (
            <button className="py-1 inline-flex items-center gap-1">
              <FaCheck className="checkmark-sharp" />
              Copied!
            </button>
          ) : (
            <button className="py-1 inline-flex items-center gap-1" onClick={()=>{
                navigator.clipboard.writeText(code)
                setCopy(true)
                setTimeout(() => {
                    setCopy(false)
                }, 3000)
            }}>
              <TbClipboardCopy className="w-6 h-6" />
              Copy code
            </button>
          )}
        </div>
        <SyntaxHighlighter
          language="python"
          style={atomOneDark}
          customStyle={{
            padding: "25px",
            minHeight: "100%",
          }}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default ShowCode;
