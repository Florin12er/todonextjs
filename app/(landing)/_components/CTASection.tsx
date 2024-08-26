import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export function CTASection() {
  const { userId } = auth();
  const isSignedIn = !!userId;

  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Organized?</h2>
        <p className="text-xl mb-8">
          {isSignedIn
            ? "Continue managing your tasks efficiently."
            : "Join thousands of users who have transformed their productivity."}
        </p>
        {isSignedIn ? (
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-purple-700 text-white hover:bg-purple-800"
            >
              Go to Dashboard <ArrowRight className="ml-2" />
            </Button>
          </Link>
        ) : (
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-purple-700 text-white hover:bg-purple-800"
            >
              Sign Up Now <ArrowRight className="ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
