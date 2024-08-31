import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export function CTASection() {
  const { userId } = auth();
  const isSignedIn = !!userId;

  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8 text-white">
          Ready to Boost Your Productivity?
        </h2>
        <p className="text-xl mb-10 text-purple-100 max-w-2xl mx-auto">
          {isSignedIn
            ? "Continue managing your tasks efficiently and take your productivity to new heights."
            : "Join thousands of users who have transformed their work habits and achieved more."}
        </p>
        {isSignedIn ? (
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-purple-100 transition-colors duration-300 text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl"
            >
              Go to Dashboard <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        ) : (
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-purple-100 transition-colors duration-300 text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl"
            >
              Sign Up Now <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
