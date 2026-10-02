import React, { useState } from 'react';
import { processBackendAssistantRequest } from '../services/backendAssistant';
import { AssistantResponse, ScreenId } from '../types';

interface BackendTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPayload: (response: AssistantResponse) => void;
}

export const BackendTerminalModal: React.FC<BackendTerminalModalProps> = ({
  isOpen,
  onClose,
  onApplyPayload,
}) => {
  const [inputQuery, setInputQuery] = useState('Settle debt for Alhaji Musa with 38000 in cash');
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [lastParsedObj, setLastParsedObj] = useState<AssistantResponse | null>(null);

  if (!isOpen) return null;

  const handleTest = (queryToRun?: string) => {
    const q = queryToRun || inputQuery;
    const result = processBackendAssistantRequest(q);

    if (typeof result === 'string') {
      setResponseOutput(result);
      setLastParsedObj(null);
    } else {
      setResponseOutput(JSON.stringify(result, null, 2));
      setLastParsedObj(result);
    }
  };

  const handleExecuteInUI = () => {
    if (lastParsedObj) {
      onApplyPayload(lastParsedObj);
      onClose();
    }
  };

  const presetTests = [
    { label: 'Settle Alhaji Musa (₦38k)', query: 'Settle debt for Alhaji Musa with 38000 in cash' },
    { label: 'Add 2 Indomie to Cart', query: 'Add 2 packs of Indomie to cart' },
    { label: 'Open Analytics Screen', query: 'Switch to analytics screen' },
    { label: 'Check Overdue Debts', query: 'Filter overdue debts' },
    { label: 'Complete Sale with Cash', query: 'Complete sale with cash and print receipt' },
    { label: 'Out of Scope (Refusal)', query: 'Add an AI chatbot to generate crypto investments' },
    { label: 'Missing Field Test', query: 'Add item to cart' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0f131c]/85 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in select-none">
      <div className="bg-[#181c24] border border-[#31353e] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#262a33] flex items-center justify-between bg-[#1c2028]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8083ff] text-[20px]">terminal</span>
            <div>
              <h3 className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee]">
                Vendora Backend Assistant Protocol
              </h3>
              <p className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0]">
                Strict Stitch Schema • Scope Lock & Anti-Drift Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a33] flex items-center justify-center text-[#908fa0] hover:text-[#dfe2ee]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex flex-col gap-3 overflow-y-auto">
          {/* Quick Presets */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0] uppercase tracking-wider font-bold">
              Test Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetTests.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setInputQuery(preset.query);
                    handleTest(preset.query);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#c7c4d7] hover:text-[#dfe2ee] font-['Hanken_Grotesk'] text-[11px] font-semibold transition-colors border border-[#31353e]"
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-['Hanken_Grotesk'] text-[11px] text-[#dfe2ee] font-semibold" htmlFor="assistantInput">
              User Input / Command
            </label>
            <div className="flex gap-2">
              <input
                id="assistantInput"
                className="flex-1 bg-[#0a0e16] border border-[#31353e] rounded-xl px-3 py-2 text-[#dfe2ee] font-['Hanken_Grotesk'] text-[13px] focus:outline-none focus:border-[#8083ff]"
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTest()}
                placeholder="Enter input (e.g. Settle debt for Alhaji Musa with 38000)..."
              />
              <button
                onClick={() => handleTest()}
                className="px-4 py-2 bg-[#8083ff] hover:bg-[#c0c1ff] text-[#0d0096] rounded-xl font-['Hanken_Grotesk'] text-[12px] font-bold shadow-md active:scale-95 transition-all"
                type="button"
              >
                Send
              </button>
            </div>
          </div>

          {/* Response Box */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0] uppercase tracking-wider font-bold">
                Assistant Response (Strict JSON Schema)
              </span>
              {lastParsedObj && (
                <span className="font-['Hanken_Grotesk'] text-[10px] text-[#4edea3] font-bold">
                  ✓ Validated against UI components
                </span>
              )}
            </div>

            <div className="p-3 bg-[#0a0e16] rounded-xl border border-[#262a33] font-mono text-[12px] text-[#4edea3] overflow-x-auto min-h-[140px] max-h-[220px]">
              {responseOutput ? (
                <pre className="whitespace-pre-wrap">{responseOutput}</pre>
              ) : (
                <span className="text-[#908fa0]">Tap a preset or send a query to see the JSON schema payload...</span>
              )}
            </div>
          </div>

          {/* Execution Button */}
          {lastParsedObj && (
            <button
              onClick={handleExecuteInUI}
              className="w-full py-3 bg-[#4edea3] hover:opacity-95 text-[#003824] rounded-xl font-['Manrope'] font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              <span>Execute Action in Live Vendora POS</span>
            </button>
          )}

          {/* Boundaries Notice */}
          <div className="bg-[#1c2028] p-2.5 rounded-lg border border-[#262a33] text-[10px] text-[#908fa0] space-y-1">
            <div className="font-bold text-[#dfe2ee]">Enforced Strict Boundaries:</div>
            <div>• Scope Lock: Refuses actions outside existing UI.</div>
            <div>• Output Lock: Returns exact <code className="text-[#c0c1ff]">{`{ screen, component, action, payload }`}</code> format.</div>
            <div>• No Hallucinated Data &amp; Anti-drift check verified.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
