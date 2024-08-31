import { CheckCircle, Zap, Users } from "lucide-react";

const features = [
  {
    title: "Easy Task Management",
    description:
      "Create, organize, and prioritize your tasks with just a few clicks.",
    icon: CheckCircle,
  },
  {
    title: "Smart Reminders",
    description: "Never miss a deadline with our intelligent reminder system.",
    icon: Zap,
  },
  {
    title: "Seamless Collaboration",
    description:
      "Share tasks and projects with team members for enhanced productivity.",
    icon: Users,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-gray-100">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 dark:bg-blue-900">
                <feature.icon
                  className="text-blue-600 dark:text-blue-300"
                  size={28}
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
