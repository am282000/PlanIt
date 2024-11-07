import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* HeroSection */}
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
          Streamline Your Workflow <br />
          with{" "}
          <Image
            src="/logo.png"
            alt="PlanIt Logo"
            height={80}
            width={400}
            className="h-14 sm:h-24 w-auto object-contain"
          />
        </h1>
        <p>Empower your team with our intutive Project Management Solution</p>
        <Link href="/onboarding">
          <Button size="1g" className="mr-4">
            Get Started <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>
        <Link href="#features">
          <Button size="1g" varient="outline" className="mr-4">
            Learn More
          </Button>
        </Link>
      </section>
    </div>
  );
}
