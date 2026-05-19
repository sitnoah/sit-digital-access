"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { schoolFAQs } from "@/lib/school-solutions";
import { cn } from "@/lib/utils";

export function SchoolFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
            School FAQ
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Practical answers for schools, centres, donors and partners.
          </h2>
          <p className="mt-4 text-base leading-8 text-muted">
            A quick guide to starting small, planning full labs, supporting teaching and preparing
            devices for long-term use.
          </p>
        </div>
        <div className="divide-y divide-line rounded-3xl border border-line bg-paper p-3 shadow-card">
          {schoolFAQs.map((faq, index) => (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpen(open === index ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-5 text-left text-base font-semibold text-ink transition hover:bg-white"
                aria-expanded={open === index}
              >
                {faq.question}
                <Icon
                  name="chevron"
                  className={cn("h-4 w-4 shrink-0 text-flame-600 transition", open === index && "rotate-180")}
                />
              </button>
              {open === index ? (
                <p className="px-4 pb-5 text-sm leading-7 text-muted">{faq.answer}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
