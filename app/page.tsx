import { ArrowRight, CheckCircle, FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import HeroAnimation from "@/components/hero-animation"
import ScrollFadeIn from "@/components/motion/ScrollFadeIn"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-hero-gradient font-body">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <div className="font-heading font-bold text-xl flex items-center gap-2">
            <div className="bg-anchor text-white p-2 rounded-lg shadow-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-anchor">Trusted</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/login" className="font-heading inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              Log in
            </Link>
            <Link href="/login" className="font-heading font-bold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm text-white h-10 px-4 py-2 bg-anchor hover:bg-anchor-light shadow-lg">
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
                  <div className="font-heading inline-flex items-center gap-2 bg-indigo-100 text-anchor px-4 py-2 rounded-full text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    AI-Powered Contract Analysis
                  </div>
                  <h1 className="font-heading text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                    Make smarter job decisions with{" "}
                    <span className="text-anchor">
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
                    className="font-heading font-bold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm text-white bg-anchor hover:bg-anchor-light shadow-lg text-lg px-8 py-6 h-auto"
                  >
                    Start Free Analysis
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                  <button className="font-heading font-bold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground text-lg px-8 py-6 h-auto">
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
                  <div className="absolute -inset-4 bg-gradient-to-r from-anchor/20 to-indigo-600/20 rounded-2xl blur-xl"></div>
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
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">How it works</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our AI-powered platform analyzes your job offers and highlights potential issues in minutes
                </p>
              </div>
            </ScrollFadeIn>
            <div className="grid gap-8 md:grid-cols-3">
              <ScrollFadeIn delay={0.1}>
                <div className="group relative bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-indigo-100">
                  <div className="mb-6 bg-anchor rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">Upload your offer</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Upload your job offer letter or contract and provide basic context about the role. We support PDF
                    files and keep your data secure.
                  </p>
                </div>
              </ScrollFadeIn>
              <ScrollFadeIn delay={0.2}>
                <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-green-100">
                  <div className="mb-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">Expert review</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our AI experts review the document, extract key clauses, and identify potential red flags using
                    advanced contract analysis.
                  </p>
                </div>
              </ScrollFadeIn>
              <ScrollFadeIn delay={0.3}>
                <div className="group relative bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-100">
                  <div className="mb-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">Get insights</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Review a detailed report with explanations and recommendations for negotiation. Download or share
                    your analysis.
                  </p>
                </div>
              </ScrollFadeIn>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-anchor text-white">
          <div className="container px-4 md:px-6">
            <ScrollFadeIn>
              <div className="text-center space-y-8">
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">Trusted by professionals everywhere</h2>
                <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">10,000+</div>
                    <div className="text-indigo-100">Contracts analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">$2.5M+</div>
                    <div className="text-indigo-100">Additional compensation negotiated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">98%</div>
                    <div className="text-indigo-100">User satisfaction rate</div>
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
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">Ready to analyze your contract?</h2>
                <p className="text-xl text-gray-600">
                  Join thousands of professionals who've made smarter career decisions with Trusted
                </p>
                <Link
                  href="/login"
                  className="font-heading font-bold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm text-white bg-anchor hover:bg-anchor-light shadow-lg text-lg px-8 py-6 h-auto"
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
              <div className="bg-anchor text-white p-2 rounded-lg">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="font-heading font-semibold text-anchor">
                Trusted
              </span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-anchor">
                Privacy
              </a>
              <a href="#" className="hover:text-anchor">
                Terms
              </a>
              <a href="#" className="hover:text-anchor">
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