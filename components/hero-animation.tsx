"use client"

import { useEffect, useState } from "react"
import { CheckCircle, TrendingUp, ArrowUp, Check, FileText, ArrowRight } from "lucide-react"

type AnimationPhase = "loading" | "analyzing" | "complete" | "transition" | "offer"

export default function HeroAnimation() {
  const [phase, setPhase] = useState<AnimationPhase>("loading")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (phase === "loading") {
          setPhase("analyzing")
          setProgress(0)
        } else if (phase === "analyzing") {
          if (progress < 100) {
            setProgress((prev) => prev + 1.5)
          } else {
            setPhase("complete")
          }
        } else if (phase === "complete") {
          setTimeout(() => setPhase("transition"), 2000)
        } else if (phase === "transition") {
          setTimeout(() => setPhase("offer"), 1500)
        } else if (phase === "offer") {
          setTimeout(() => {
            setPhase("loading")
            setProgress(0)
          }, 4000)
        }
      },
      phase === "analyzing" ? 80 : phase === "loading" ? 2000 : 1500,
    )

    return () => clearTimeout(timer)
  }, [phase, progress])

  const bgColor = "#F8FAFC" // Light slate background
  const accentColor = "#2563EB" // Blue-600

  return (
    <div className="relative">
      <div
        className="absolute -left-6 -top-6 h-80 w-80 rounded-2xl -z-10 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${accentColor}20, #7C3AED20)`,
          filter: "blur(20px)",
        }}
      ></div>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 w-full max-w-lg transition-all duration-700 backdrop-blur-sm">
        {phase === "loading" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Job Offer</h3>
              </div>
              <div className="h-3 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
              <div className="h-4 w-48 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse"></div>
                    <div className="h-3 w-44 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-2.5 w-72 bg-gray-100 rounded-full animate-pulse"></div>
                  <div className="h-2.5 w-64 bg-gray-100 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "analyzing" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-lg flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, #7C3AED)` }}
                >
                  <div className="h-3 w-3 rounded-full bg-white animate-pulse"></div>
                </div>
                <h3 className="text-lg font-semibold" style={{ color: accentColor }}>
                  Trusted Expert Review
                </h3>
              </div>
              <div
                className="h-3 w-40 rounded-full shadow-sm"
                style={{ background: `linear-gradient(135deg, ${accentColor}40, #7C3AED40)` }}
              ></div>
              <div
                className="h-4 w-48 rounded-full shadow-sm"
                style={{ background: `linear-gradient(135deg, ${accentColor}60, #7C3AED60)` }}
              ></div>
            </div>
            <div className="space-y-4">
              {[
                { color: "#EF4444", label: "Red Flags", delay: 0 },
                { color: "#F59E0B", label: "Non-Standard", delay: 2000 },
                { color: "#10B981", label: "Standard Terms", delay: 4000 },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-5 w-5 rounded-full transition-all duration-700 shadow-lg ${
                        progress > (i + 1) * 30 ? "scale-110" : ""
                      }`}
                      style={{
                        backgroundColor: progress > (i + 1) * 30 ? item.color : "#E5E7EB",
                        boxShadow: progress > (i + 1) * 30 ? `0 4px 12px ${item.color}40` : "none",
                      }}
                    ></div>
                    <div
                      className={`h-3 rounded-full transition-all duration-700 ${
                        progress > (i + 1) * 30 ? "w-44" : "w-36"
                      }`}
                      style={{
                        backgroundColor: progress > (i + 1) * 30 ? "#374151" : "#E5E7EB",
                      }}
                    ></div>
                    {progress > (i + 1) * 30 && (
                      <span className="text-sm text-gray-600 animate-fadeIn font-medium">{item.label}</span>
                    )}
                  </div>
                  <div
                    className={`h-2.5 bg-gray-100 rounded-full transition-all duration-700 ${
                      progress > (i + 1) * 30 ? "w-72" : "w-56"
                    }`}
                  ></div>
                  <div
                    className={`h-2.5 bg-gray-100 rounded-full transition-all duration-700 ${
                      progress > (i + 1) * 30 ? "w-64" : "w-48"
                    }`}
                  ></div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                <div
                  className="h-2 rounded-full transition-all duration-200 shadow-sm"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(135deg, ${accentColor}, #7C3AED)`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center font-medium">Analyzing contract clauses...</p>
            </div>
          </div>
        )}

        {phase === "complete" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-green-700">Analysis Complete</h3>
              </div>
              <div className="h-3 w-40 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full shadow-sm"></div>
              <div className="h-4 w-48 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full shadow-sm"></div>
            </div>
            <div className="space-y-4">
              {[
                { color: "#EF4444", status: "Red Flags Identified" },
                { color: "#F59E0B", status: "Issues to Review" },
                { color: "#10B981", status: "Standard Terms" },
              ].map((item, i) => (
                <div key={i} className="space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full shadow-lg" style={{ backgroundColor: item.color }}></div>
                    <div className="h-3 w-44 bg-gray-600 rounded-full shadow-sm"></div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="h-2.5 w-72 bg-gray-100 rounded-full"></div>
                  <div className="h-2.5 w-64 bg-gray-100 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "transition" && (
          <div className="space-y-6 animate-slideIn">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2" style={{ color: accentColor }}>
                  <CheckCircle className="h-6 w-6" />
                  <span className="font-medium">Analysis</span>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 animate-pulse" />
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-6 w-6" />
                  <span className="font-medium">Optimization</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium">Generating negotiation recommendations...</p>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Identifying opportunities</span>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor }}></div>
                    <div
                      className="h-2 w-2 rounded-full animate-bounce"
                      style={{ backgroundColor: accentColor, animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full animate-bounce"
                      style={{ backgroundColor: accentColor, animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === "offer" && (
          <div className="space-y-6 animate-slideIn">
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-green-600">Optimized Offer</h3>
              <p className="text-sm text-gray-500 font-medium">Based on your analysis results</p>
            </div>

            <div className="space-y-4 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-sm">
              <div className="flex justify-between items-center animate-slideInItem">
                <span className="font-medium text-gray-700">Salary</span>
                <ArrowUp className="h-6 w-6 text-green-600 font-bold" />
              </div>
              <div className="flex justify-between items-center animate-slideInItem" style={{ animationDelay: "0.1s" }}>
                <span className="font-medium text-gray-700">Bonus</span>
                <ArrowUp className="h-6 w-6 text-green-600 font-bold" />
              </div>
              <div className="flex justify-between items-center animate-slideInItem" style={{ animationDelay: "0.2s" }}>
                <span className="font-medium text-gray-700">Equity</span>
                <ArrowUp className="h-6 w-6 text-green-600 font-bold" />
              </div>
              <div className="flex justify-between items-center animate-slideInItem" style={{ animationDelay: "0.3s" }}>
                <span className="font-medium text-gray-700">Terms</span>
                <Check className="h-6 w-6 text-green-600 font-bold" />
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium animate-fadeIn shadow-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Ready to negotiate!</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes slideInItem {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.8s ease-out forwards;
        }

        .animate-slideInItem {
          animation: slideInItem 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
