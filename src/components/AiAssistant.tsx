import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import {
  Sparkles,
  Send,
  RotateCcw,
  Copy,
  Check,
  Dumbbell,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Bot,
  User,
} from 'lucide-react';

interface AiAssistantProps {
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        "Namaste aur welcome to Hulk's Work Zone! 💪 Mai hoon aapka AI Fitness Coach.\n\nAap mujhse **Hindi**, **Hinglish**, ya **English** mein workouts, nutrition, protein, BMR/TDEE calculations, ya beginner gym routines ke baare mein kuch bhi pooch sakte hain.\n\nKaise shuru karein?",
      timestamp: Date.now(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const suggestedPrompts = [
    'Beginner workout kaise start karu? 💪',
    'BMR aur TDEE mein kya difference hai?',
    'Protein ke baare mein simple language mein samjhao.',
    'Progressive overload kya hota hai?',
    'Leg day ke basic exercises batao.',
    'Workout consistency kaise improve karun?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle incoming external prompt from calculators
  useEffect(() => {
    if (externalPrompt) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) {
        onClearExternalPrompt();
      }
    }
  }, [externalPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setErrorMsg(null);
    setInputMessage('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history excluding system errors
      const conversationPayload = messages
        .filter((m) => !m.isError)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation: conversationPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to contact AI Coach.');
      }

      const botMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Koi response nahi mila, kripya dobara try karein.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('AI chat error:', err);
      const errorMessageText =
        err.message || 'Kuch technical problem aayi hai. Kripya thodi der baad try karein.';
      setErrorMsg(errorMessageText);

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Error: ${errorMessageText}`,
          timestamp: Date.now(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          "Chat clear kar di gayi hai. Aap naya sawal pooch sakte hain! Hindi, Hinglish ya English kisi me bhi puchiye. 🏋️‍♂️",
        timestamp: Date.now(),
      },
    ]);
    setErrorMsg(null);
  };

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleRetryLast = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      // Remove any trailing error
      setMessages((prev) => prev.filter((m) => !m.isError));
      handleSendMessage(lastUserMsg.content);
    }
  };

  return (
    <section id="ai-coach" className="py-16 sm:py-24 bg-neutral-950 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real AI Fitness Assistant • Bilingual</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight">
            Coach Hulk AI <span className="text-emerald-400">Assistant</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base mt-2.5 leading-relaxed">
            Poochiye apne workouts, diet, macros, aur fitness concepts ke baare mein in{' '}
            <span className="text-emerald-400 font-semibold">Hindi</span>,{' '}
            <span className="text-lime-400 font-semibold">Hinglish</span>, ya{' '}
            <span className="text-white font-semibold">English</span>.
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] sm:h-[700px]">
          {/* Chat Header Bar */}
          <div className="px-5 py-4 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center text-neutral-950 shadow-md shadow-emerald-500/20">
                <Dumbbell className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-white text-base">
                    Coach Hulk
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <span className="text-xs text-neutral-400 block -mt-0.5">
                  Hulk's Work Zone AI Fitness Guide
                </span>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 transition-colors"
              title="Clear conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                    isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                      isUser
                        ? 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed relative group ${
                      isUser
                        ? 'bg-emerald-500 text-neutral-950 font-medium rounded-tr-none shadow-md shadow-emerald-500/10'
                        : msg.isError
                        ? 'bg-rose-950/40 border border-rose-800 text-rose-200 rounded-tl-none'
                        : 'bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Message Action (Copy) for Bot */}
                    {!isUser && !msg.isError && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-850 flex items-center justify-between text-[11px] text-neutral-400">
                        <span>Coach Hulk</span>
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="hover:text-white transition-colors flex items-center gap-1"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading / Typing Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Coach Hulk typing</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}

            {/* Error banner with retry */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-between text-xs text-rose-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  onClick={handleRetryLast}
                  className="px-3 py-1 bg-rose-900/80 hover:bg-rose-800 rounded-lg font-bold text-white transition-colors shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Carousel */}
          <div className="px-4 py-2.5 bg-neutral-950/60 border-t border-neutral-800/80 overflow-x-auto scrollbar-none flex gap-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <HelpCircle className="w-3 h-3" />
              Quick:
            </span>
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap text-xs text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-800 hover:border-neutral-700 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-neutral-950 border-t border-neutral-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2.5"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Poochiye (Hindi, Hinglish, English)... Press Enter to send"
                disabled={isLoading}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none max-h-32 min-h-[48px]"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                aria-label="Send message"
                className="p-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:hover:bg-emerald-400 text-neutral-950 font-bold transition-all shadow-md shadow-emerald-500/20 shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {/* Disclaimer */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                Educational fitness advice only. Consult a doctor before starting new intense programs.
              </span>
              <span className="hidden sm:inline text-neutral-400">Shift + Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
