import { Card } from "@/components/ui/Card";
import { HighlightStatCard } from "@/components/ui/HighlightStatCard";
import LetsConnect from "@/components/ui/LetsConnect";
import { MapPin, Sparkles, Code2, Zap, Target, ArrowRight } from "lucide-react";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section - Full Width
            Green panel (40px corners) with a "tab" dropping down on the right,
            joined to the panel by an inverted corner on desktop. */}
        <section aria-label="Introduction" className="mb-12 sm:mb-16">
          {/* Vertical gradient that ends on exactly primary-500, the tab's
              color, so the panel, inverted corner and tab join seamlessly */}
          <div className="group relative overflow-hidden rounded-t-[40px] rounded-bl-[40px] lg:rounded-br-none rounded-br-[40px] bg-linear-to-b from-primary-400 to-primary-500 p-10 ">
            {/* Dot-grid texture, fading out toward the bottom */}
            <div
              className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] bg-size-[22px_22px] mask-[linear-gradient(to_bottom,black,transparent_75%)]"
              aria-hidden="true"
            />
            {/* Soft light behind the portrait; kept off the bottom edge so
                the panel's base color matches the tab exactly (no seam) */}
            {/* <div
              className="absolute top-0 right-0  w-96 h-96 rounded-full bg-white/25 blur-3xl pointer-events-none"
              aria-hidden="true"
            /> */}
            <div className="relative flex flex-col items-center lg:items-start">
              {/* Text: dark on green in both themes (~7:1 contrast) */}
              <div className="pb-4 sm:pb-6 text-center md:text-left">
                <p className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/25 backdrop-blur-sm ring-1 ring-white/40 text-sm font-medium text-gray-900 mb-5">
                  👋 Hello, I&apos;m
                </p>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-gray-900 mb-4">
                  Haytham
                </h1>

                <p className="text-xl sm:text-2xl leading-snug text-primary-950 max-w-md md:mx-0">
                  Frontend Developer crafting{" "}
                  {/* Yellow highlighter stroke under the key words */}
                  <span className="bg-linear-to-r from-secondary-400 to-secondary-400 bg-no-repeat bg-size-[100%_35%] bg-position-[0_90%] px-0.5">
                    beautiful, functional
                  </span>{" "}
                  web experiences
                </p>
              </div>

              {/* Stack, from package.json */}
              <ul
                aria-label="Tech stack"
                className="flex flex-wrap gap-2 mt-auto"
              >
                {["React", "TypeScript", "Supabase", "Tailwind CSS"].map(
                  (tech) => (
                    <li
                      key={tech}
                      className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30 text-xs font-semibold text-gray-900"
                    >
                      {tech}
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Decorative image frame */}
            <div className="absolute right-12 bottom-8 w-90 h-90 border border-white/30 rounded-full hidden lg:block pointer-events-none"></div>

            {/* Profile image */}
            <div>
              <img
                src="profile.webp"
                alt="Profile Picture"
                className="absolute scale-75 hidden w-100 md:block md:left-[23%] lg:left-[45%] bottom-14 transform translate-x-1/2 translate-y-1/2 group-hover:translate-y-45 grayscale-75 group-hover:grayscale-0 transition duration-300 ease-in-out drop-shadow-2xl drop-shadow-black/80"
              />
            </div>
          </div>

          {/* Bottom row: chips on the left, green tab on the right */}
          <div className="flex flex-col lg:flex-row text-sm">
            {/* Left side */}
            {/* lg:pr-12 keeps the chips clear of the 44px inverted corner */}
            <div className="relative w-full lg:w-2/5 flex flex-wrap lg:flex-nowrap justify-center lg:justify-start items-center gap-2.5 lg:gap-2 p-5 sm:p-8 lg:pl-4 lg:pr-12">
              {/* Inverted corner where the tab meets the panel (desktop) */}
              <div
                className="hidden lg:block absolute w-11 h-11 top-0 right-0 bg-primary-500"
                aria-hidden="true"
              >
                <div
                  className="absolute w-11 h-11 bg-white dark:bg-gray-950"
                  style={{ borderTopRightRadius: "44px" }}
                />
              </div>

              <span className="flex items-center gap-2 px-4 lg:px-3 py-2 rounded-full whitespace-nowrap border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                <MapPin
                  className="w-4 h-4 text-primary-700 dark:text-primary-400"
                  aria-hidden="true"
                />
                Ljubljana, Slovenia
              </span>

              <span className="flex items-center gap-2 px-4 lg:px-3 py-2 rounded-full whitespace-nowrap border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 font-medium z-10">
                <span className="relative flex w-2.5 h-2.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-primary-600" />
                </span>
                Available for opportunities
              </span>
            </div>

            {/* Right side: the tab */}
            <div className="w-full lg:w-3/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary-500 px-8 py-6 sm:py-7 rounded-[28px] lg:rounded-t-none lg:rounded-b-[40px] mt-2 lg:mt-0">
              <div className="text-center sm:text-left">
                <p className="text-lg font-bold text-gray-900">
                  Have a role or a project in mind?
                </p>
                <p className="text-sm text-primary-950/80">
                  Let&apos;s talk about how I can help.
                </p>
              </div>
              {/* A real link styled as the yellow button (a link inside a
                  button isn't clickable on the button's edges) */}
              <a
                href="mailto:haythamsaba@gmail.com?subject=Let's%20Connect"
                className="group/cta btn btn-secondary btn-md shrink-0 rounded-xl min-h-11 font-semibold shadow-md"
              >
                Let&apos;s connect
                <ArrowRight
                  className="w-4 h-4 ml-2 transition-transform group-hover/cta:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - About */}
          <div className="lg:col-span-2 space-y-6">
            {/* Story Card */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-primary-600" />
                The Story
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  I built{" "}
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    HabitFlow
                  </span>{" "}
                  in 40 days to showcase my skills in modern web development.
                  What started as a portfolio project evolved into a
                  production-ready application with real users.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Originally from Palestine 🇵🇸, now based in Slovenia 🇸🇮, I
                  focus on building intuitive interfaces that solve real
                  problems. I love clean code, thoughtful UX, and shipping
                  products that people actually want to use.
                </p>
              </div>
            </Card>

            {/* Key Skills - Visual Grid */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                What I Do Best
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex gap-3 p-4 bg-linear-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl border-primary-500 border">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      React Arch.
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Component composition, custom hooks, state management
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border-blue-500 border">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      TypeScript
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Type-safe, maintainable code with strict mode
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border-purple-500 border">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex--0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      UI/UX Design
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Responsive, accessible, beautiful interfaces
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-linear-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 rounded-xl border-secondary-500 border">
                  <div className="w-10 h-10 bg-secondary-600 rounded-lg flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Full-Stack
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Supabase, PostgreSQL, real-time applications
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* HabitFlow Highlights */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                🎯 HabitFlow Highlights
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <HighlightStatCard value="40" label="Days Built" />
                <HighlightStatCard value="7.5K+" label="Lines of Code" />
                <HighlightStatCard value="85+" label="Components" />
              </div>
            </Card>
          </div>

          {/* Right Column - Contact & Tech */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card
              className="p-6 bg-secondary-500 dark:bg-secondary-500"
              style={{ backgroundColor: "#ffcf36 " }}
            >
              <LetsConnect />
            </Card>

            {/* Status Badge */}
            <Card className="p-6 bg-linear-to-br from-green-50 to-green-100 dark:from-green-300/20 dark:to-green-500/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full animate-pulse shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Open to Work
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seeking frontend/full-stack opportunities in Europe
                  </p>
                </div>
              </div>
            </Card>

            {/* Tech Stack - Compact */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "React",
                  "TypeScript",
                  "Next.js",
                  "JavaScript",
                  "Tailwind",
                  "Bootstrap",
                  "Supabase",
                  "Vite",
                  "Vercel",
                  "And More...",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
