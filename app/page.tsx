import { ArrowRight, CheckCircle, FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import HeroAnimation from "@/components/hero-animation"
import ScrollFadeIn from "@/components/motion/ScrollFadeIn"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <div className="font-semibold text-xl flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg shadow-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Trusted</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/login" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    AI-Powered Contract Analysis
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                    Make smarter job decisions with{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      AI-powered
                    </span>{" "}
                    contract reviews
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                    Trusted helps professionals analyze offer letters, extract key insights, and identify red flags
                    before you sign. Get expert-level contract review in minutes, not days.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-lg py-6 h-auto"
                  >
                    Start Free Analysis
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 text-lg py-6 h-auto border-2"
                  >
                    Watch Demo
                  </button>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Free to start
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    5-minute analysis
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Expert insights
                  </div>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl"></div>
                  <div className="relative">
                    <HeroAnimation />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-white relative">
          <div className="container px-4 md:px-6">
            <ScrollFadeIn>
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our AI-powered platform analyzes your job offers and highlights potential issues in minutes
                </p>
              </div>
            </ScrollFadeIn>
            <div className="grid gap-8 md:grid-cols-3">
              <ScrollFadeIn delay={0.1}>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm group relative bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <div className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Upload your offer</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-gray-600 leading-relaxed">
                      Upload your job offer letter or contract and provide basic context about the role. We support PDF
                      files and keep your data secure.
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
              <ScrollFadeIn delay={0.2}>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm group relative bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <div className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Expert review</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-gray-600 leading-relaxed">
                      Our AI experts review the document, extract key clauses, and identify potential red flags using
                      advanced contract analysis.
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
              <ScrollFadeIn delay={0.3}>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm group relative bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <div className="mb-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Get insights</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-gray-600 leading-relaxed">
                      Review a detailed report with explanations and recommendations for negotiation. Download or share
                      your analysis.
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container px-4 md:px-6">
            <ScrollFadeIn>
              <div className="text-center space-y-8">
                <h2 className="text-3xl font-bold sm:text-4xl">Trusted by professionals everywhere</h2>
                <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">10,000+</div>
                    <div className="text-blue-100">Contracts analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">$2.5M+</div>
                    <div className="text-blue-100">Additional compensation negotiated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">98%</div>
                    <div className="text-blue-100">User satisfaction rate</div>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <ScrollFadeIn>
              <div className="text-center space-y-8 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold sm:text-4xl">Ready to analyze your contract?</h2>
                <p className="text-xl text-gray-600">
                  Join thousands of professionals who've made smarter career decisions with Trusted
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-lg py-6 h-auto"
                >
                  Get Started Free
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
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Trusted
              </span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900">
                Terms
              </a>
              <a href="#" className="hover:text-gray-900">
                Support
              </a>
            </div>
            <p className="text-sm text-gray-500">© 2025 Trusted. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 