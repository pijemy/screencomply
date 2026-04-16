import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-xl font-bold">ScreenComply</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Built for Florida screen contractors
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Stop wrestling with<br />
            <span className="text-primary">permits and compliance</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Compliance checklists, license verification, permit tracking, and HOA workflows — 
            built specifically for Florida screen enclosure contractors. 
            Save 2-5 hours per project.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md text-lg font-medium hover:bg-primary/90"
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="border border-border px-8 py-3 rounded-md text-lg font-medium hover:bg-accent"
            >
              See Demo
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to stay compliant
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Compliance Wizard",
                description: "Select your project type and county — get an instant checklist of everything you need.",
                icon: "📋",
              },
              {
                title: "License Verification",
                description: "Enter a contractor license number and instantly verify status, expiration, and endorsements.",
                icon: "✅",
              },
              {
                title: "Permit Lookup",
                description: "Orange, Seminole, and Osceola county permit requirements — fees, forms, timelines, all in one place.",
                icon: "🏛️",
              },
              {
                title: "Project Tracker",
                description: "Track every project's compliance status: permits, inspections, HOA, insurance — never miss a step.",
                icon: "📊",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Counties */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            Orlando metro covered
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Starting with the three counties that matter most to your business.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Orange County", projects: "Most common — Orlando, Winter Park, Apopka, Ocoee", flag: "🟠" },
              { name: "Seminole County", projects: "Sanford, Lake Mary, Altamonte Springs, Longwood", flag: "🔵" },
              { name: "Osceola County", projects: "Kissimmee, St. Cloud, Celebration, Poinciana", flag: "🟢" },
            ].map((county) => (
              <div key={county.name} className="border rounded-lg p-6 text-center">
                <div className="text-2xl mb-2">{county.flag}</div>
                <h3 className="font-semibold mb-1">{county.name}</h3>
                <p className="text-sm text-muted-foreground">{county.projects}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pays for itself on the first project
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="border rounded-lg p-8">
              <h3 className="text-lg font-semibold mb-1">Solo Contractor</h3>
              <div className="text-4xl font-bold mb-1">
                $49<span className="text-lg font-normal text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Save $100-500 per project in compliance time
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Unlimited projects
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Compliance wizard
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> License verification
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Permit lookup
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Project tracking
                </li>
              </ul>
            </div>
            <div className="border-2 border-primary rounded-lg p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                Popular
              </div>
              <h3 className="text-lg font-semibold mb-1">Multi-Crew</h3>
              <div className="text-4xl font-bold mb-1">
                $99<span className="text-lg font-normal text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                For companies with 2+ crews on the road
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Everything in Solo
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Team accounts (5 users)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Priority support
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Export reports
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Compliance deadline alerts
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-sm font-medium">ScreenComply</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 ScreenComply. Built for Florida screen contractors.
          </p>
        </div>
      </footer>
    </div>
  );
}