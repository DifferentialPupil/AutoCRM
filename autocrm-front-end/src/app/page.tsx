import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center px-4 py-24 text-center bg-gradient-to-b from-background to-muted">
        <div className="container max-w-4xl flex flex-col items-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Transform Your Customer Relationships
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
            AutoCRM helps businesses streamline customer interactions, boost engagement, and drive growth with intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/login">
              <Button size="lg" className="text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="https://calendly.com/azaldinfreidoon" target="_blank">
              <Button size="lg" variant="outline" className="text-lg">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full container py-24 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose AutoCRM?
        </h2>
        <Separator className="my-8 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Automate repetitive tasks and focus on what matters most - building relationships with your customers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>360° Customer View</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get a complete view of your customer interactions, preferences, and history in one unified platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data-Driven Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Make informed decisions with powerful analytics and actionable insights about your customer base.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-muted py-16 flex items-center justify-center">
        <div className="container max-w-4xl flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl text-center">
            Join thousands of businesses already using AutoCRM to deliver exceptional customer experiences.
          </p>
          <Button size="lg" className="text-lg">
            Start Free Trial
          </Button>
        </div>
      </section>
    </main>
  );
}
