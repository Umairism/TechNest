import { Navbar } from "@/components/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="py-20 border-b border-border bg-gradient-to-b from-secondary/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">About TechNest</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Your trusted source for premium PC components since 2020
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At TechNest, we believe that building a powerful PC shouldn&apos;t be complicated.
                Our mission is to provide tech enthusiasts, gamers, and professionals with the
                highest quality components at competitive prices.
              </p>
              <p className="text-lg text-muted-foreground">
                We carefully curate our product selection to ensure every item meets our
                standards for performance, reliability, and value.
              </p>
            </div>
            <div className="bg-gradient-to-br from-secondary to-muted rounded-lg p-12 flex items-center justify-center">
              <span className="text-8xl">🏢</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality First",
                description:
                  "We only stock products from trusted manufacturers known for excellence",
                icon: "⭐",
              },
              {
                title: "Customer Focus",
                description:
                  "Your satisfaction is our top priority with dedicated 24/7 support",
                icon: "💪",
              },
              {
                title: "Competitive Pricing",
                description: "Best prices in the market without compromising quality",
                icon: "💰",
              },
            ].map((value) => (
              <div key={value.title} className="bg-card border border-border rounded-lg p-8">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Happy Customers" },
              { number: "500+", label: "Products" },
              { number: "4.8/5", label: "Average Rating" },
              { number: "24/7", label: "Customer Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-accent mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
