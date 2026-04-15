import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Download } from 'lucide-react';
import { cn } from '../lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'lua', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gojo_mod_menu.lua';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("relative rounded-lg overflow-hidden border border-border-main bg-bg-main flex flex-col", className)}>
      <div className="flex items-center justify-between px-4 h-10 bg-editor-header border-b border-border-main">
        <div className="flex items-center h-full">
          <div className="text-xs font-semibold text-accent border-b-2 border-accent h-full flex items-center px-2">
            gojo_mod_menu.lua
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium text-subtext hover:text-accent transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'تم النسخ' : 'نسخ'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs font-medium text-subtext hover:text-accent transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            تحميل
          </button>
        </div>
      </div>
      <div className="max-h-[600px] overflow-auto custom-scrollbar">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '20px',
            background: 'transparent',
            fontSize: '13px',
            lineHeight: '1.6',
            fontFamily: 'var(--font-mono)'
          }}
          showLineNumbers
          lineNumberStyle={{ minWidth: '40px', paddingRight: '16px', color: '#3b4261', textAlign: 'center' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
