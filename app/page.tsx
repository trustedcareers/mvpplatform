import { ArrowRight, CheckCircle, FileText, Sparkle, Sparkles, Star } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/Logo"
import HeroAnimation from "@/components/hero-animation"
import ScrollFadeIn from "@/components/motion/ScrollFadeIn"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <Logo asLink />
          <div className="ml-auto flex items-center gap-4">
            <Link href="/login" className="font-heading inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 text-brand hover:bg-section-purple hover:text-brand">
              Log in
            </Link>
            <Link href="/login" className="font-heading font-bold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm text-white h-10 px-4 py-2 bg-brand bg-primary-gradient hover:bg-primary-hover shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-violet-50">
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-[#2e2a72]/10 text-[#2e2a72] px-4 py-2 rounded-full text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    For professionals reviewing job offers
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-heading text-gray-900">
                    Know what you're signing — and{" "}
                    <span className="bg-gradient-to-r from-[#2e2a72] to-purple-600 bg-clip-text text-transparent">
                      what to push for.
                    </span>
                  </h1>
                  <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                    Trusted breaks down your offer, flags risks, and helps you make a decision you won't second-guess.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Link
                    href="/login"
                    className="font-heading font-bold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm text-white bg-primary-gradient hover:bg-primary-hover shadow-lg text-lg px-8 py-6 h-auto"
                  >
                    Start Free Review
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                  <button className="font-heading font-bold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm border border-brand bg-white hover:bg-section-purple hover:text-brand text-lg px-8 py-6 h-auto">
                    Watch Demo
                  </button>
                </div>
                <div className="flex items-center gap-6 text-sm text-brand/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    No wait
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Your eyes only
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Reviewed by experts
                  </div>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary-gradient rounded-2xl blur-xl"></div>
                  <div className="relative">
                    <HeroAnimation />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-section-purple relative">
          <div className="container px-4 md:px-6">
            <ScrollFadeIn>
              <div className="text-center space-y-4 mb-16">
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">How it works</h2>
                <p className="text-xl text-brand/80 max-w-3xl mx-auto">
                Trusted reviews your offer and flags what's risky, missing, or worth pushing for — in minutes, not days.
                </p>
              </div>
            </ScrollFadeIn>
            <div className="grid gap-8 md:grid-cols-3">
              <ScrollFadeIn delay={0.1}>
                <div className="group relative bg-section-violet p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-section-purple">
                  <div className="mb-6 bg-brand rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">Upload your offer</h3>
                  <p className="text-brand/80 leading-relaxed">
                  Drop in your offer and share a few quick details — your role, level, and what matters most to you.
                  </p>
                </div>
              </ScrollFadeIn>
              <ScrollFadeIn delay={0.2}>
                <div className="group relative bg-success/10 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-success/20">
                  <div className="mb-6 bg-gradient-to-r from-success to-green-400 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">Expert review</h3>
                  <p className="text-brand/80 leading-relaxed">
                  We extract key clauses, benchmark them against market norms, and flag anything unusual — or worth a second look.
                  </p>
                </div>
              </ScrollFadeIn>
              <ScrollFadeIn delay={0.3}>
                <div className="group relative bg-section-purple p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-section-violet">
                  <div className="mb-6 bg-gradient-to-r from-brand to-purple-500 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">Get insights</h3>
                  <p className="text-brand/80 leading-relaxed">
                  Get a clear, expert-reviewed summary with negotiation recommendations you can actually use.
                  </p>
                </div>
              </ScrollFadeIn>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-brand text-white">
          <div className="container px-4 md:px-6">
            <ScrollFadeIn>
              <div className="text-center space-y-8">
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">Trusted by professionals everywhere</h2>
                <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">100%</div>
                    <div className="text-section-violet">said they felt more confident negotiating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">15%+</div>
                    <div className="text-section-violet">average improvement in total comp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">1:1</div>
                    <div className="text-section-violet">Expert review incldued with every analysis</div>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-section-violet">
          <div className="container px-4 md:px-6">
            <ScrollFadeIn>
              <div className="text-center space-y-8 max-w-3xl mx-auto">
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">Don't sign blind.</h2>
                <p className="text-xl text-brand/80">
                Join others who reviewed their offer — and walked into their next role with leverage.
                </p>
                <Link
                  href="/login"
                  className="font-heading font-bold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm text-white bg-primary-gradient hover:bg-primary-hover shadow-lg text-lg px-8 py-6 h-auto"
                >
                  Get Started Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </ScrollFadeIn>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <Logo />
            <div className="flex gap-6 text-sm text-brand/80">
              <a href="#" className="hover:text-brand">
                Privacy
              </a>
              <a href="#" className="hover:text-brand">
                Terms
              </a>
              <a href="#" className="hover:text-brand">
                Support
              </a>
            </div>
            <p className="text-sm text-brand/50">© 2025 Trusted. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 