
import React, { useState } from 'react';
import { CodeExample } from '../types';

interface CodeBlockProps {
  example: CodeExample;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ example }) => {
  const [showOutput, setShowOutput] = useState(false);

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden my-4 border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{example.language}</span>
        <button 
          onClick={() => setShowOutput(!showOutput)}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            showOutput ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
        >
          {showOutput ? 'إخفاء المخرجات' : 'تشغيل الكود (محاكاة)'}
        </button>
      </div>
      
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-slate-300 font-mono">
          <code>{example.code}</code>
        </pre>
      </div>

      <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-700/50">
        <p className="text-sm text-slate-400 leading-relaxed italic">
          <strong className="text-slate-200 ml-1">توضيح:</strong>
          {example.explanation}
        </p>
      </div>

      {showOutput && (
        <div className="p-4 bg-black border-t border-slate-700">
          <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-tighter">المخرجات المتوقعة (Console):</h4>
          <pre className="text-sm text-emerald-400 font-mono">
            <code>{example.expectedOutput}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
