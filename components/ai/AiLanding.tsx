"use client"

import Link from "next/link"
import { SignInButton } from "@clerk/nextjs"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import GenerationDemo from "@/components/ai/GenerationDemo"
import { PROMPT_EXAMPLES, libraryImage } from "@/components/ai/examples"
import { FREE_PER_DAY, PLANS } from "@/lib/pricing"

const EASE = [0.23, 1, 0.32, 1] as const

/** Signed-out view of /ai-generate: explains the tool and gates it behind sign-in. */
export default function AiLanding() {
  const reduce = useReducedMotion()
  const enter = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: EASE } }
  const gallery = PROMPT_EXAMPLES.slice(0, 5)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="grid items-center gap-12 pb-20 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-20">
        <div className="min-w-0 lg:col-span-5">
          <motion.p {...enter(0)} className="text-sm font-medium text-violet-600 dark:text-violet-400">
            AI wallpaper generator
          </motion.p>
          <motion.h1
            {...enter(0.05)}
            className="mt-4 text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[3.5rem]"
          >
            Type a sentence.
            <span className="block text-muted-foreground">Get a wallpaper.</span>
          </motion.h1>
          <motion.p {...enter(0.1)} className="mt-6 max-w-[25rem] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Describe any scene and get an original 16:9 wallpaper in about 15 seconds. Nobody else will have it.
          </motion.p>
          <motion.div {...enter(0.15)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <SignInButton mode="modal" fallbackRedirectUrl="/ai-generate" signUpFallbackRedirectUrl="/ai-generate">
              <button
                type="button"
                className="group inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Start creating
                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" strokeWidth={1.75} />
              </button>
            </SignInButton>
            <p className="text-sm text-muted-foreground">
              {FREE_PER_DAY} free a day with an account
            </p>
          </motion.div>
        </div>

        <motion.div {...enter(0.2)} className="min-w-0 lg:col-span-7">
          <GenerationDemo />
        </motion.div>
      </section>

      <section className="border-t border-border/70 py-16 sm:py-20" aria-labelledby="ai-gallery-heading">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 id="ai-gallery-heading" className="text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
              Made from a sentence
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              AI originals from our library, with the kind of prompt behind each one. Sign in and start from any of them.
            </p>
          </div>
          <Link
            href="/"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline sm:inline-flex"
          >
            Browse the library
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
          {gallery.map((ex, n) => (
            <li key={ex.file} className={n === 0 ? "col-span-2 lg:row-span-2 lg:flex" : ""}>
              <SignInButton mode="modal" fallbackRedirectUrl="/ai-generate" signUpFallbackRedirectUrl="/ai-generate">
                <button type="button" className="group flex w-full flex-col text-left focus-visible:outline-none">
                  <div
                    className={`relative overflow-hidden rounded-xl bg-muted ring-1 ring-black/5 transition-shadow duration-200 group-focus-visible:ring-2 group-focus-visible:ring-violet-500 dark:ring-white/10 ${
                      n === 0 ? "aspect-[16/10] lg:aspect-auto lg:min-h-0 lg:flex-1" : "aspect-[16/10]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- ImageKit-sized */}
                    <img
                      src={libraryImage(ex.file, n === 0 ? 1100 : 600)}
                      alt={ex.title}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-cover transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.03] ${n === 0 ? "lg:absolute lg:inset-0" : ""}`}
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">{ex.title}</p>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">{ex.prompt}</p>
                </button>
              </SignInButton>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline sm:hidden"
        >
          Browse the library
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </section>

      <section className="border-t border-border/70 py-14 sm:py-16" aria-label="Plan details">
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
          <div>
            <dt className="text-sm text-muted-foreground">Output</dt>
            <dd className="mt-1.5 text-base font-medium text-foreground">1344 × 768, 16:9</dd>
            <dd className="mt-1 text-sm text-muted-foreground">Sized for laptops and desktops. Full quality download.</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Free</dt>
            <dd className="mt-1.5 text-base font-medium text-foreground">{FREE_PER_DAY} wallpapers a day</dd>
            <dd className="mt-1 text-sm text-muted-foreground">Just sign in. No card needed.</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Need more</dt>
            <dd className="mt-1.5 text-base font-medium text-foreground">Credits from ${PLANS.credits_50.priceUsd}</dd>
            <dd className="mt-1 text-sm text-muted-foreground">
              Or go Pro for a monthly allowance.{" "}
              <Link href="/pricing" className="font-medium text-violet-600 underline-offset-4 hover:underline dark:text-violet-400">
                See pricing
              </Link>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
