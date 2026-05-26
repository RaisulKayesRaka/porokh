import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatisticsSection() {
  const stats = [
    { label: "Exams Conducted", value: "1M+" },
    { label: "Active Institutions", value: "500+" },
    { label: "Questions Created", value: "10M+" },
    { label: "Uptime Guarantee", value: "99.9%" },
  ];

  return (
    <section className="w-full py-20 bg-background border-b">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl md:text-4xl font-bold">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
