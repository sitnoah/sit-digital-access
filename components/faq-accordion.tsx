"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/types";

type FAQAccordionProps = {
  items: FAQItem[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-white shadow-soft">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-semibold text-ink transition hover:bg-paper"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={cn("h-5 w-5 shrink-0 text-flame-600 transition", isOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            {isOpen ? (
              <div className="px-5 pb-6">
                <p className="text-sm leading-6 text-muted">{item.answer}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
