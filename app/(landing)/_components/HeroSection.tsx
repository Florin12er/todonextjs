import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export function HeroSection() {
  const { userId } = auth();
  const isSignedIn = !!userId;

  return (
    <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Manage Your Tasks with Ease
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Stay organized, focused, and in control with our powerful todo app.
        </p>
        {isSignedIn ? (
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-gray-100"
            >
              Go to Dashboard <ArrowRight className="ml-2" />
            </Button>
          </Link>
        ) : (
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-gray-100"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
