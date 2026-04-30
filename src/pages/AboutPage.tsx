import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Code2,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react";

export function AboutPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section - Full Width */}
          <div className="bg-gray-50 overflow-hidden mb-20">
            <div className="group relative overflow-hidden rounded-t-[40px] rounded-l-[40px] bg-primary-500 p-8 sm:p-12 text-black min-h-65 sm:min-h-80">
              {/* Decorative blurred background shapes */}
              <div className="absolute top-10 right-10 w-72 h-72 bg-white/20 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
              <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-primary-300 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

              {/* Subtle texture */}
              <div className="absolute inset-0 opacity-10 pointer-events-none"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 shadow-primary-500 shadow-lg">
                  👋 Hello, I&apos;m
                </div>

                <h1 className="text-4xl sm:text-5xl text-gray-900 lg:text-6xl font-bold mb-4">
                  Haytham
                </h1>

                <p className="text-xl sm:text-2xl text-primary-900 mb-6 max-w-125">
                  Frontend Developer crafting beautiful, functional web
                  experiences
                </p>
              </div>

              {/* Decorative image frame */}
              <div className="absolute right-12 bottom-8 w-90 h-90 border border-white/30 rounded-full hidden lg:block pointer-events-none"></div>

              {/* Profile image */}
              <div>
                <img
                  src="profile-picture-removebg-preview.png"
                  alt="Profile Picture"
                  className="absolute hidden w-100 md:w-125 md:block md:left-[23%] lg:left-[45%] bottom-10 transform translate-x-1/2 translate-y-1/2 group-hover:translate-y-56 grayscale-75 group-hover:grayscale-0 transition duration-300 ease-in-out drop-shadow-2xl drop-shadow-black/80"
                />
              </div>
            </div>

            {/* Bottom section */}
            <div className="relative flex flex-col lg:flex-row justify-between text-sm">
              {/* Left side */}
              <div className="flex flex-col justify-center sm:flex-row w-full lg:w-1/2 items-center sm:items-center gap-4 bg-gray-50 p-4 sm:p-8 rounded-bl-[40px] relative z-10">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-primary-500 shadow-lg">
                  {/* Corner mask — only needed on desktop where sections are side by side */}
                  <div className="hidden lg:block absolute w-11 h-11 top-0 right-0 bg-primary-500">
                    <div
                      className="absolute w-11 h-11 bg-gray-50"
                      style={{ borderTopRightRadius: "44px" }}
                    />
                  </div>
                  <MapPin className="w-4 h-4" />
                  Ljubljana, Slovenia
                </div>

                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-primary-500 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Available for opportunities
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center bg-primary-500 w-full lg:w-3/5 p-8 rounded-br-[40px] rounded-bl-[40px] relative z-10">
                <div>
                  <Button variant="secondary">
                    <a href="mailto:haythamsaba@gmail.com?subject=Let's Connect">Let's connect</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

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
              <Card className="p-6 sm:p-8 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  🎯 HabitFlow Highlights
                </h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="text-center bg-primary-200 dark:bg-gray-800 p-4 rounded-3xl">
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                      40
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Days Built
                    </div>
                  </div>
                  <div className="text-center bg-primary-200 dark:bg-gray-800 p-4 rounded-3xl">
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                      7.5K+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Lines of Code
                    </div>
                  </div>
                  <div className="text-center bg-primary-200 dark:bg-gray-800 p-4 rounded-3xl">
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                      85+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Components
                    </div>
                  </div>
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Let's Connect
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:haythamsaba@gmail.com"
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 border border-transparent transition-all group"
                  >
                    <Mail className="w-5 h-5 text-primary-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Email
                    </span>
                    <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/haytham-saba-401148278/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 border border-transparent transition-all group"
                  >
                    <Linkedin className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      LinkedIn
                    </span>
                    <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </a>

                  <a
                    href="https://github.com/HaythamSaba"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900/20 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all group"
                  >
                    <Github className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      GitHub
                    </span>
                    <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <a
                    href="mailto:haythamsaba@gmail.com?subject=HabitFlow%20Feedback"
                    className="block w-full text-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-medium transition-colors"
                  >
                    Send Feedback
                  </a>
                </div>
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
    </DashboardLayout>
  );
}
