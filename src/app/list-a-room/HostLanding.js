"use client";

import Link from "next/link";
import { Camera, Inbox, Handshake } from "lucide-react";
import { FadeIn, FadeInOnView, Stagger, StaggerItem } from "@/components/FadeIn";
import FaqAccordion from "@/components/FaqAccordion";

const FORM_HREF = "/list-a-room/new";

const PROOF = [
  "Free to list",
  "Direct practitioner inquiries",
  "No agency contracts",
];

const STEPS = [
  {
    title: "1. Create your listing",
    description:
      "Add photos, a day rate, and the days the room is free. Most hosts finish this in a few minutes.",
    icon: Camera,
  },
  {
    title: "2. Receive inquiries",
    description:
      "When a clinician is interested, their message goes to your email. AlliedRooms does not take a booking cut.",
    icon: Inbox,
  },
  {
    title: "3. Set the terms",
    description:
      "You review credentials, run a walkthrough, and agree days and rates. You keep 100% of the rental income.",
    icon: Handshake,
  },
];

const HOST_FAQS = [
  {
    question: "Does AlliedRooms charge a booking fee or commission?",
    answer:
      "No. Listing is free during early access. Day-rate payments are arranged directly between you and the practitioner — AlliedRooms does not take a cut.",
  },
  {
    question: "Who will be renting my rooms?",
    answer:
      "Allied health professionals looking for sessional days — psychologists, OTs, physios, speech pathologists, and similar clinicians. You review each inquiry and decide who you take on.",
  },
  {
    question: "What control do I have over who enters my clinic?",
    answer:
      "You keep it. Inquiries come to you so you can check credentials, arrange a walkthrough, and agree terms before anyone uses the room.",
  },
];

export default function HostLanding() {
  return (
    <>
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <span className="inline-block rounded-full bg-stone-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-stone-700">
            For clinic hosts
          </span>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="mt-6 font-sans text-4xl font-black tracking-tight text-stone-900 sm:text-5xl sm:leading-[1.1]">
            Fill unused consulting days,{" "}
            <span className="text-teal-900">on your terms</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
            List vacant sessional rooms on Melbourne’s allied health directory.
            Zero commission, inquiries to your inbox, and you decide who uses the
            space.
          </p>
        </FadeIn>

        <FadeIn delay={0.24}>
          <Link
            href={FORM_HREF}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:bg-teal-950 active:scale-95"
          >
            List your space free
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {PROOF.map((label) => (
              <span
                key={label}
                className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600"
              >
                {label}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>

      <FadeInOnView delay={0.32} className="mx-auto mt-12 max-w-3xl sm:mt-16">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Unused capacity
          </span>
          <h2 className="mt-2 font-sans text-2xl font-black text-stone-900">
            Empty days still cost the practice
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            An unused consulting room two days a week can mean around{" "}
            <strong className="font-semibold text-stone-900">$15,000 a year</strong>{" "}
            in unlisted capacity — for example two days at $150 over 50 weeks.
            AlliedRooms lists your suite for psychologists, OTs, physios, and
            speech pathologists looking for day-rate space. You still choose who
            you take on.
          </p>
        </section>
      </FadeInOnView>

      <section className="mt-12 sm:mt-16">
        <FadeInOnView delay={0.08} className="mb-6 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            How it works
          </span>
          <h2 className="mt-2 font-sans text-2xl font-black text-stone-900">
            Three steps, then a private preview
          </h2>
        </FadeInOnView>
        <Stagger delay={0.16} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-900/10 text-teal-900">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-sans text-lg font-black text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {item.description}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <FadeInOnView delay={0.24} className="mt-12 sm:mt-16">
        <section className="rounded-2xl border border-stone-200 bg-white px-6 pb-6 shadow-sm sm:px-8">
          <h2 className="pt-6 font-sans text-xl font-black text-stone-900">
            Host FAQs
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Fees, who inquires, and who you let into the clinic.
          </p>
          <FaqAccordion items={HOST_FAQS} />
        </section>
      </FadeInOnView>

      <FadeInOnView delay={0.32} className="mt-12 text-center sm:mt-16">
        <Link
          href={FORM_HREF}
          className="inline-flex items-center justify-center rounded-full bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:bg-teal-950 active:scale-95"
        >
          List your space free
        </Link>
      </FadeInOnView>
    </>
  );
}
