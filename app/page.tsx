import Link from "next/link";

const features = [
  {
    title: "Job Scorer",
    description: "Paste a job description and get an A-F rating with detailed feedback.",
    href: "/score",
    icon: "🎯",
    color: "border-green-500/30 hover:border-green-500",
  },
  {
    title: "Resume Builder",
    description: "Generate a tailored resume optimized for a specific job posting.",
    href: "/resume",
    icon: "📄",
    color: "border-blue-500/30 hover:border-blue-500",
  },
  {
    title: "Application Tracker",
    description: "Track every application, status, and follow-up in one place.",
    href: "/tracker",
    icon: "📋",
    color: "border-purple-500/30 hover:border-purple-500",
  },
  {
    title: "Job Scanner",
    description: "Search multiple job boards at once for roles that match your profile.",
    href: "/scanner",
    icon: "🔍",
    color: "border-yellow-500/30 hover:border-yellow-500",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-green-400">MissionNext</h1>
          <p className="text-xs text-gray-500">Career transition platform for veterans</p>
        </div>
        <Link
          href="/settings"
          className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-all"
        >
          ⚙️ Settings
        </Link>
      </header>

      {/* Hero */}
      <div className="px-8 py-16 text-center">
        <div className="inline-block bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-1 rounded-full mb-6">
          Built for those who served
        </div>
        <h2 className="text-5xl font-bold mb-4">
          Your next mission <br />
          <span className="text-green-400">starts here</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          AI-powered tools to help veterans find, evaluate, and land the right civilian role.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="px-8 pb-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className={`block p-6 rounded-xl border bg-gray-900 transition-all ${feature.color}`}
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-8 py-6 text-center text-xs text-gray-600">
        MissionNext — Inspired by career-ops by Santiago (MIT License)
      </footer>
    </div>
  );
}
