"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { faqs } from "@/lib/faq-data";

interface FaqItemProps {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ q, a, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="border border-gray-100 rounded-brand overflow-hidden">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors",
          isOpen ? "bg-brand-blue-pale text-brand-blue" : "bg-white text-brand-dark hover:bg-gray-50"
        )}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-sm leading-snug">{q}</span>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 transition-transform duration-300",
            isOpen ? "rotate-180 text-brand-blue" : "text-gray-400"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="px-5 py-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 bg-white">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-14 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-brand-blue rounded-full" />
        <div>
          <h2 className="font-head text-xl font-black text-brand-dark tracking-tight uppercase">
            Questions fréquentes
          </h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Tout ce que vous voulez savoir avant de nous contacter
          </p>
        </div>
      </div>

      {/* Accordion */}
      <div className="space-y-2 max-w-3xl">
        {faqs.map((faq, i) => (
          <FaqItem
            key={i}
            q={faq.q}
            a={faq.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
