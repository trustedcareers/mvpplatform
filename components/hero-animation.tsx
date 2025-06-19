"use client"

import { useEffect, useState } from "react"
import { FileText, CheckCircle, TrendingUp, ArrowUp, Check, ArrowRight } from 'lucide-react'
import { ComponentType } from 'react'

type AnimationPhase = "loading" | "analyzing" | "complete" | "transition" | "offer"

// Cast icons to ComponentType to fix TypeScript errors
const FileTextIcon = FileText as ComponentType<any>
const CheckCircleIcon = CheckCircle as ComponentType<any>
const TrendingUpIcon = TrendingUp as ComponentType<any>
const ArrowUpIcon = ArrowUp as ComponentType<any>
const CheckIcon = Check as ComponentType<any>
const ArrowRightIcon = ArrowRight as ComponentType<any>

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
            setProgress((prev) => prev + 1.5) // Slower progress
          } else {
            setPhase("complete")
          }
        } else if (phase === "complete") {
          setTimeout(() => setPhase("transition"), 2000) // Longer pause
        } else if (phase === "transition") {
          setTimeout(() => setPhase("offer"), 1500)
        } else if (phase === "offer") {
          setTimeout(() => {
            setPhase("loading")
            setProgress(0)
          }, 4000) // Longer display time
        }
      },
      phase === "analyzing" ? 80 : phase === "loading" ? 2000 : 1500, // Slower overall pace
    )

    return () => clearTimeout(timer)
  }, [phase, progress])

  // Custom color variables
  const bgColor = "#EAEAF4" // Lighter version of 2E2A72
  const accentColor = "#2E2A72" // The deep indigo color

  return (
    <div className="relative">
      <div
        className="absolute -left-4 -top-4 h-72 w-72 rounded-lg -z-10 animate-pulse"
        style={{ backgroundColor: bgColor }}
      ></div>
      <div className="bg-white border rounded-lg shadow-lg p-6 w-full max-w-md transition-all duration-700">
        {phase === "loading" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <FileTextIcon className="h-5 w-5" style={{ color: accentColor }} />
                <h3 className="text-sm font-semibold text-gray-700">Job Offer</h3>
              </div>
              <div className="h-2.5 w-32 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-3 w-40 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-gray-300 animate-pulse"></div>
                    <div className="h-2.5 w-40 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-2 w-64 bg-gray-100 rounded-full animate-pulse"></div>
                  <div className="h-2 w-56 bg-gray-100 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "analyzing" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="h-5 w-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: accentColor }}
                >
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                </div>
                <h3 className="text-sm font-semibold" style={{ color: accentColor }}>
                  Trusted Expert Review
                </h3>
              </div>
              <div
                className="h-2.5 w-32 rounded-full"
                style={{ backgroundColor: `${accentColor}33` }}
              ></div>
              <div
                className="h-3 w-40 rounded-full"
                style={{ backgroundColor: `${accentColor}4D` }}
              ></div>
            </div>
            <div className="space-y-3">
              {[
                { color: "red", label: "Red Flags", delay: 0 },
                { color: "yellow", label: "Non-Standard", delay: 2000 },
                { color: "green", label: "Standard Terms", delay: 4000 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-4 w-4 rounded-full transition-all duration-700 ${
                        progress > (i + 1) * 30 ? `bg-${item.color}-500 scale-110` : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ${
                        progress > (i + 1) * 30 ? "bg-gray-600 w-40" : "bg-gray-200 w-32"
                      }`}
                    ></div>
                    {progress > (i + 1) * 30 && (
                      <span className="text-xs text-gray-500 animate-fadeIn">{item.label}</span>
                    )}
                  </div>
                  <div
                    className={`h-2 bg-gray-100 rounded-full transition-all duration-700 ${
                      progress > (i + 1) * 30 ? "w-64" : "w-48"
                    }`}
                  ></div>
                  <div
                    className={`h-2 bg-gray-100 rounded-full transition-all duration-700 ${
                      progress > (i + 1) * 30 ? "w-56" : "w-40"
                    }`}
                  ></div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%`, backgroundColor: accentColor }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">Analyzing contract clauses...</p>
            </div>
          </div>
        )}

        {phase === "complete" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <h3 className="text-sm font-semibold text-green-700">Analysis Complete</h3>
              </div>
              <div className="h-2.5 w-32 bg-green-200 rounded-full"></div>
              <div className="h-3 w-40 bg-green-300 rounded-full"></div>
            </div>
            <div className="space-y-3">
              {[
                { color: "red", status: "Red Flags Identified" },
                { color: "yellow", status: "Issues to Review" },
                { color: "green", status: "Standard Terms" },
              ].map((item, i) => (
                <div key={i} className="space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full bg-${item.color}-500`}></div>
                    <div className="h-2.5 w-40 bg-gray-600 rounded-full"></div>
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="h-2 w-64 bg-gray-100 rounded-full"></div>
                  <div className="h-2 w-56 bg-gray-100 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "transition" && (
          <div className="space-y-4 animate-slideIn">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2" style={{ color: accentColor }}>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Analysis</span>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400 animate-pulse" />
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUpIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Optimization</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Generating negotiation recommendations...</p>
            </div>

            <div
              className="p-4 rounded-lg border border-gray-200"
              style={{ background: `linear-gradient(to right, ${bgColor}, #f0fff4)` }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Identifying opportunities</span>
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
          <div className="space-y-4 animate-slideIn">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-green-600">Optimized Offer</h3>
              <p className="text-xs text-gray-500">Based on your analysis results</p>
            </div>

            <div className="space-y-3 bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex justify-between items-center animate-slideInItem">
                <span className="text-sm font-medium">Salary</span>
                <ArrowUpIcon className="h-5 w-5 text-green-600 font-bold" />
              </div>
              <div className="flex justify-between items-center animate-slideInItem" style={{ animationDelay: "0.1s" }}>
                <span className="text-sm font-medium">Bonus</span>
                <ArrowUpIcon className="h-5 w-5 text-green-600 font-bold" />
              </div>
              <div className="flex justify-between items-center animate-slideInItem" style={{ animationDelay: "0.2s" }}>
                <span className="text-sm font-medium">Equity</span>
                <ArrowUpIcon className="h-5 w-5 text-green-600 font-bold" />
              </div>
              <div className="flex justify-between items-center animate-slideInItem" style={{ animationDelay: "0.3s" }}>
                <span className="text-sm font-medium">Terms</span>
                <CheckIcon className="h-5 w-5 text-green-600 font-bold" />
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm animate-fadeIn">
                <CheckCircleIcon className="h-4 w-4" />
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