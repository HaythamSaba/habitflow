import { Github, Linkedin, Mail } from "lucide-react";
import React from "react";
import ContactLinkCard from "./ContactLinkCard";

export default function LetsConnect() {
  return (
    <>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Let's Connect</h3>
      <div className="space-y-3">
        <ContactLinkCard
          href="mailto:haythamsaba@gmail.com"
          icon={<Mail />}
          label="Email"
          color="primary"
        />

        <ContactLinkCard
          href="https://www.linkedin.com/in/haytham-saba-401148278/"
          icon={<Linkedin />}
          label="LinkedIn"
          color="blue"
        />

        <ContactLinkCard
          href="https://github.com/HaythamSaba"
          icon={<Github />}
          label="GitHub"
          color="gray"
        />

      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <a
          href="mailto:haythamsaba@gmail.com?subject=HabitFlow%20Feedback"
          className="block w-full text-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-medium transition-colors"
        >
          Send Feedback
        </a>
      </div>
    </>
  );
}
