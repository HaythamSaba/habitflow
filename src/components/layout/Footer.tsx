import { Github, Linkedin, Mail, Heart, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          {/* Left side - About */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              <span className="text-primary-600 dark:text-primary-400 font-bold">
                HabitFlow
              </span>
              • Build Better Habits
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Built with
              <Heart className="w-3 h-3 inline text-red-500 mx-0.5" /> by
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Haytham
              </span>
              • Frontend Developer
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              📍 Ljubljana, Slovenia 🇸🇮
            </p>
          </div>

          {/* Right side - Social Links */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Connect with me
            </p>
            <div className="flex items-center gap-3">
              <a
                href="mailto:haythamsaba@gmail.com"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all hover:scale-110"
                title="Email me"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/haytham-saba-401148278/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/HaythamSaba/habitflow"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all hover:scale-110"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {currentYear} HabitFlow. Built as a portfolio project.
            </p>

            <div className="flex items-center gap-4 text-xs">
              <a
                href="/about"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
              >
                About
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="mailto:haythamsaba@gmail.com?subject=HabitFlow%20Feedback"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
              >
                Send Feedback
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://github.com/HaythamSaba/habitflow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
              >
                Source Code
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
