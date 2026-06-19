const stats = [
  { value: "10K+", label: "Exams Created" },
  { value: "50K+", label: "Questions Built" },
  { value: "99.9%", label: "Uptime" },
  { value: "<5s", label: "Avg. Grading Time" },
];

export default function StatisticsSection() {
  return (
    <section className="bg-gradient-to-r from-violet-600 to-indigo-600 py-16 md:py-20 dark:from-violet-700 dark:to-indigo-700">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center ${
                index > 0
                  ? "md:border-l md:border-white/20 md:pl-8"
                  : ""
              }`}
            >
              <p className="text-4xl font-extrabold text-white md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
