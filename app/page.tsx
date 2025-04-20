import { Encryption } from "@/components/main/encryption";
import { Hero } from "@/components/main/hero";
import { Certificates } from "@/components/main/certificates";
import { Skills } from "@/components/main/skills";
import { Blogs } from "@/components/main/blogs";
import { Languages } from "@/components/main/languages";
import { Contact } from "@/components/main/contact";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <Encryption />
        <Certificates />
        <Blogs />
        <Languages />
        <Contact />
      </div>
    </main>
  );
}
