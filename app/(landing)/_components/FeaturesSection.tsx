import { CheckCircle } from "lucide-react";

const features = [
  {
    title: "Easy Task Management",
    description:
      "Create, organize, and prioritize your tasks with just a few clicks.",
  },
  {
    title: "Smart Reminders",
    description: "Never miss a deadline with our intelligent reminder system.",
  },
  {
    title: "Seamless Collaboration",
    description:
      "Share tasks and projects with team members for enhanced productivity.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="text-green-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
