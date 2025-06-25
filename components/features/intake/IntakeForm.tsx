"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { DollarSign, TrendingUp, ShieldCheck, UserCheck, Users, Home, Compass, Laptop, Lock, LineChart, Handshake, Flag, Scale, Ban, Smile } from 'lucide-react';

const LEVELS = ["entry", "mid", "senior", "exec"];
const SITUATIONS = ["laid off", "offer in hand", "exploring"];
const PRIORITIES = ["equity", "comp", "growth", "stability"];

const PRIORITY_OPTIONS = [
  { key: "compensation", icon: DollarSign, label: "Compensation", subtext: "Salary, equity, bonuses" },
  { key: "growth", icon: TrendingUp, label: "Growth", subtext: "Promotions, new skills" },
  { key: "ownership", icon: ShieldCheck, label: "Ownership", subtext: "Autonomy and decision-making" },
  { key: "manager_fit", icon: UserCheck, label: "Manager Fit", subtext: "Trust and alignment with your boss" },
  { key: "team_culture", icon: Users, label: "Team Culture", subtext: "Smart, kind, collaborative people" },
  { key: "work_life_balance", icon: Home, label: "Work-Life Balance", subtext: "Reasonable hours and flexibility" },
  { key: "mission_fit", icon: Compass, label: "Mission Fit", subtext: "Work that feels meaningful" },
  { key: "remote_flexibility", icon: Laptop, label: "Remote / Flexibility", subtext: "Location independence" },
  { key: "stability", icon: Lock, label: "Stability", subtext: "Safe bet, predictable income" },
  { key: "company_trajectory", icon: LineChart, label: "Company Trajectory", subtext: "High-growth or strong fundamentals" },
];

export default function IntakeForm() {
  const { register, handleSubmit, control, reset, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const user = useUser();
  const supabaseClient = createClientComponentClient();

  // Watch confidence rating for display
  const confidenceRating = watch('confidence_rating', 3);

  // Stepper state
  const [step, setStep] = useState<number>(1);
  // Priorities state
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [priorityOrder, setPriorityOrder] = useState<string[]>(["", "", ""]); // fallback to dropdowns for ranking
  const [savingPriorities, setSavingPriorities] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>("");

  // Step 2 state
  const [reflection, setReflection] = useState("");
  const [negotiationStyles, setNegotiationStyles] = useState<string[]>([]);
  const [savingStep2, setSavingStep2] = useState(false);
  const [step2Error, setStep2Error] = useState("");
  const [step2Success, setStep2Success] = useState("");

  const [negotiationConfidence, setNegotiationConfidence] = useState(5);
  const [companyNeedsYou, setCompanyNeedsYou] = useState(5);
  const [youNeedJob, setYouNeedJob] = useState(5);

  const [showInspiration, setShowInspiration] = useState(false);

  const NEGOTIATION_OPTIONS = [
    { key: "collaborative", label: "Seek win-win outcomes (Collaborative)", icon: Handshake },
    { key: "competitive", label: "Stand firm for your interests (Competitive)", icon: Flag },
    { key: "compromising", label: "Quickly find a compromise (Compromising)", icon: Scale },
    { key: "avoidant", label: "Avoid conflict (Avoidant)", icon: Ban },
    { key: "accommodating", label: "Accommodate the other side (Accommodating)", icon: Smile },
  ];

  // Load existing profile data
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!user) {
        setLoadingData(false);
        return;
      }

      console.log('[IntakeForm] Loading existing profile for user:', user.id);
      
      try {
        const { data: profile, error } = await supabaseClient
          .from("user_context")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('[IntakeForm] Error loading profile:', error);
        } else if (profile) {
          console.log('[IntakeForm] Found existing profile:', profile);
          setExistingProfile(profile);
          
          // Populate form with existing data
          setValue('role_title', profile.role_title || '');
          setValue('level', profile.level || '');
          setValue('industry', profile.industry || '');
          setValue('situation', profile.situation || '');
          setValue('target_comp_base', profile.target_comp_base || '');
          setValue('target_comp_total', profile.target_comp_total || '');
          setValue('priorities', profile.priorities || []);
          setValue('confidence_rating', profile.confidence_rating || 3);
        } else {
          console.log('[IntakeForm] No existing profile found');
        }
      } catch (error) {
        console.error('[IntakeForm] Error loading profile:', error);
      }
      
      setLoadingData(false);
    };

    loadExistingProfile();
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    console.log('[IntakeForm] Starting submission with data:', data);
    setLoading(true);
    setResult(null);

    if (!user) {
      console.log('[IntakeForm] No user found');
      setResult("Authentication error. Please log in.");
      setLoading(false);
      return;
    }

    const profileData = {
      ...data,
      user_id: user.id,
      priorities: data.priorities || [],
      confidence_rating: Number(data.confidence_rating),
      target_comp_base: Number(data.target_comp_base),
      target_comp_total: Number(data.target_comp_total),
    };

    console.log('[IntakeForm] Profile data:', profileData);

    try {
      let result;
      
      if (existingProfile) {
        // Update existing profile
        console.log('[IntakeForm] Updating existing profile');
        result = await supabaseClient
          .from("user_context")
          .update(profileData)
          .eq("user_id", user.id);
      } else {
        // Create new profile
        console.log('[IntakeForm] Creating new profile');
        result = await supabaseClient
          .from("user_context")
          .insert([profileData]);
      }

      console.log('[IntakeForm] Database result:', result);

      if (result.error) {
        console.error('[IntakeForm] Database error:', result.error);
        setResult("Error: " + result.error.message);
      } else {
        console.log('[IntakeForm] Successfully saved user context');
        setResult(existingProfile ? "Profile updated successfully!" : "Profile created successfully!");
        
        // If this was a new profile, mark it as existing for future updates
        if (!existingProfile) {
          setExistingProfile(profileData);
        }
      }
    } catch (error: any) {
      console.error('[IntakeForm] Submission error:', error);
      setResult("Error: " + error.message);
    }

    setLoading(false);
  };

  // Step 1: Priorities selection UI
  const handlePrioritySelect = (key: string) => {
    if (selectedPriorities.includes(key)) {
      // Remove from selected priorities and all dropdowns
      const newSelected = selectedPriorities.filter((p) => p !== key);
      const newOrder = priorityOrder.map((p) => (p === key ? "" : p));
      setSelectedPriorities(newSelected);
      setPriorityOrder(newOrder);
    } else if (selectedPriorities.length < 3) {
      // Add to selected priorities and fill first empty slot in order
      const newSelected = [...selectedPriorities, key];
      const idx = priorityOrder.findIndex((p) => p === "");
      if (idx !== -1) {
        const newOrder = [...priorityOrder];
        newOrder[idx] = key;
        setPriorityOrder(newOrder);
        setSelectedPriorities(newSelected);
      }
    }
  };

  // Move priority up or down in the list
  const movePriority = (idx: number, direction: 'up' | 'down') => {
    const newOrder = [...priorityOrder];
    if (direction === 'up' && idx > 0) {
      [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    } else if (direction === 'down' && idx < newOrder.length - 1) {
      [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
    }
    setPriorityOrder(newOrder);
    setSelectedPriorities(newOrder.filter((p) => p));
  };

  // Remove a priority from the list
  const removePriority = (idx: number) => {
    const newOrder = [...priorityOrder];
    newOrder.splice(idx, 1);
    while (newOrder.length < 3) newOrder.push("");
    setPriorityOrder(newOrder);
    setSelectedPriorities(newOrder.filter((p) => p));
  };

  // Save priorities to Supabase when moving to Step 2
  const handleNextStep = async () => {
    setSavingPriorities(true);
    setSaveError("");
    try {
      if (!user) throw new Error("User not authenticated");
      const prioritiesToSave = priorityOrder.filter((p) => p);
      const { data: contextData, error: contextError } = await supabaseClient
        .from("user_context")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (contextData) {
        // Update existing row
        const { error: updateError } = await supabaseClient
          .from("user_context")
          .update({ priorities: prioritiesToSave })
          .eq("user_id", user.id);
        if (updateError) throw updateError;
      } else {
        // Insert new row
        const { error: insertError } = await supabaseClient
          .from("user_context")
          .insert({ user_id: user.id, priorities: prioritiesToSave });
        if (insertError) throw insertError;
      }
      setStep(2);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save priorities");
    } finally {
      setSavingPriorities(false);
    }
  };

  const handleNegotiationStyleChange = (key: string) => {
    setNegotiationStyles((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleStep2Submit = async () => {
    setSavingStep2(true);
    setStep2Error("");
    setStep2Success("");
    try {
      if (!user) throw new Error("User not authenticated");
      const { data: contextData, error: contextError } = await supabaseClient
        .from("user_context")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (contextData) {
        // Update existing row
        const { error: updateError } = await supabaseClient
          .from("user_context")
          .update({
            reflection,
            negotiation_styles: negotiationStyles,
            negotiation_confidence: negotiationConfidence,
            company_needs_you: companyNeedsYou,
            you_need_job: youNeedJob,
          })
          .eq("user_id", user.id);
        if (updateError) throw updateError;
      } else {
        // Insert new row
        const { error: insertError } = await supabaseClient
          .from("user_context")
          .insert({
            user_id: user.id,
            reflection,
            negotiation_styles: negotiationStyles,
            negotiation_confidence: negotiationConfidence,
            company_needs_you: companyNeedsYou,
            you_need_job: youNeedJob,
          });
        if (insertError) throw insertError;
      }
      setStep2Success("Profile updated successfully!");
    } catch (err: any) {
      setStep2Error(err.message || "Failed to save");
    } finally {
      setSavingStep2(false);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-md mx-auto text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  // Stepper UI
  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>1</div>
        <div className="w-12 h-1 bg-gray-300 mx-2" />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>2</div>
      </div>
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">What are you prioritizing most in your next role?</h2>
          <p className="text-gray-600 mb-4">Pick up to 3 priorities you'd like to focus on. Then drag to rank them in order of importance.</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {PRIORITY_OPTIONS.map((opt) => {
              const selected = selectedPriorities.includes(opt.key);
              return (
                <button
                  type="button"
                  key={opt.key}
                  className={`flex flex-col items-center justify-center text-center p-3 border rounded-lg shadow-sm transition-all focus:outline-none ${selected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'} ${selectedPriorities.length === 3 && !selected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handlePrioritySelect(opt.key)}
                  disabled={selectedPriorities.length === 3 && !selected}
                >
                  <span className="mb-1 w-full flex justify-center">
                    {opt.icon && <opt.icon className="w-6 h-6 text-[#2E2A72]" />}
                  </span>
                  <span className="font-medium w-full flex justify-center">{opt.label}</span>
                  <span className="text-xs text-gray-500 w-full flex justify-center">{opt.subtext}</span>
                </button>
              );
            })}
          </div>
          {/* Ranking area: simple list with up/down arrows */}
          {selectedPriorities.length > 1 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Rank your selected priorities</h3>
              <div className="flex flex-col gap-3 items-center">
                {priorityOrder.filter((p) => p).map((p, idx, arr) => {
                  const opt = PRIORITY_OPTIONS.find((o) => o.key === p);
                  if (!opt) return null;
                  return (
                    <div key={p} className="flex items-center w-80 p-3 border rounded-lg bg-white shadow-sm">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold mr-4 border-2 border-blue-400 bg-blue-50">{idx + 1}</div>
                      <span className="mr-3">
                        {opt.icon && <opt.icon className="w-6 h-6 text-[#2E2A72]" />}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.subtext}</div>
                      </div>
                      <div className="flex flex-col gap-1 ml-2">
                        <button type="button" className="bg-[#2E2A72] hover:bg-[#23205a] text-white rounded-full p-1 disabled:opacity-50" onClick={() => movePriority(idx, 'up')} disabled={idx === 0} aria-label="Move up">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 4l-6 8h12l-6-8z" fill="currentColor"/></svg>
                        </button>
                        <button type="button" className="bg-[#2E2A72] hover:bg-[#23205a] text-white rounded-full p-1 disabled:opacity-50" onClick={() => movePriority(idx, 'down')} disabled={idx === arr.length - 1} aria-label="Move down">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 20l6-8H6l6 8z" fill="currentColor"/></svg>
                        </button>
                      </div>
                      <button type="button" className="ml-2 bg-[#2E2A72] hover:bg-[#23205a] text-white rounded-full p-1" onClick={() => removePriority(idx)} aria-label="Remove">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-[#2E2A72] text-white px-4 py-2 rounded-md hover:bg-[#23205a] disabled:opacity-50 flex items-center justify-center"
              onClick={handleNextStep}
              disabled={priorityOrder.filter((p) => p).length === 0 || savingPriorities}
            >
              {savingPriorities ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  Saving...
                </span>
              ) : (
                "Next"
              )}
            </button>
          </div>
          {saveError && (
            <div className="text-red-600 text-sm mt-2 text-center">{saveError}</div>
          )}
        </div>
      )}
      {step === 2 && (
        <div className="max-w-xl mx-auto mt-6">
          <div className="text-xl font-semibold mb-4 text-center">Let's make this next role a better fit for you.</div>
          <div className="text-sm text-gray-500 mb-2 text-center">Step 2: What Matters Most</div>

          {/* 1. Sliders first */}
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-1">How confident do you feel about negotiating your next offer?</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">No confidence</span>
              <input
                type="range"
                min={0}
                max={5}
                value={negotiationConfidence}
                onChange={e => setNegotiationConfidence(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
                aria-valuenow={negotiationConfidence}
                aria-valuemin={0}
                aria-valuemax={5}
                aria-label="Negotiation confidence"
              />
              <span className="text-sm font-semibold text-indigo-700 w-6 text-center">{negotiationConfidence}</span>
              <span className="text-xs text-gray-500">Extremely confident</span>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-1">How badly do you think the company needs you for this role?</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Not at all</span>
              <input
                type="range"
                min={0}
                max={5}
                value={companyNeedsYou}
                onChange={e => setCompanyNeedsYou(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
                aria-valuenow={companyNeedsYou}
                aria-valuemin={0}
                aria-valuemax={5}
                aria-label="Company needs you"
              />
              <span className="text-sm font-semibold text-indigo-700 w-6 text-center">{companyNeedsYou}</span>
              <span className="text-xs text-gray-500">They are desperate for you</span>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-1">How badly do you need this job?</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Not at all</span>
              <input
                type="range"
                min={0}
                max={5}
                value={youNeedJob}
                onChange={e => setYouNeedJob(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
                aria-valuenow={youNeedJob}
                aria-valuemin={0}
                aria-valuemax={5}
                aria-label="You need job"
              />
              <span className="text-sm font-semibold text-indigo-700 w-6 text-center">{youNeedJob}</span>
              <span className="text-xs text-gray-500">I am desperate for this job</span>
            </div>
          </div>

          {/* 2. Reflection textarea (What matters most to you) */}
          <div className="relative mb-6">
            <textarea
              className="w-full min-h-[120px] border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2E2A72] mb-4 text-base placeholder:text-gray-400"
              placeholder="E.g., 'I am looking for a step up in compensation and responsibility.'"
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              onFocus={() => setShowInspiration(true)}
              onBlur={() => setShowInspiration(false)}
              onMouseEnter={() => setShowInspiration(true)}
              onMouseLeave={() => setShowInspiration(false)}
            />
            <div
              className={`absolute left-1/2 -translate-x-1/2 mt-2 w-full max-w-md z-20 transition-opacity duration-200 ${showInspiration ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              style={{ top: '100%' }}
            >
              <div className="bg-gray-50 border-l-4 border-indigo-500 p-3 rounded-md text-sm text-gray-700 shadow-lg">
                <div className="font-semibold mb-1">Need inspiration?</div>
                <ul className="space-y-1">
                  <li>“I am looking for a step up in compensation and responsibility.”</li>
                  <li>“I am aiming to increase my annual compensation by 15%.”</li>
                  <li>“I am transitioning out of one industry and into another, so need help calibrating what to anchor on.”</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Negotiation style cards with updated prompt */}
          <div className="mb-6">
            <div className="text-base text-gray-700 mb-2 font-medium">Pick the style(s) that reflect your preferred negotiation approach.</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NEGOTIATION_OPTIONS.map(opt => {
                const selected = negotiationStyles.includes(opt.key);
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.key}
                    role="checkbox"
                    aria-checked={selected}
                    tabIndex={0}
                    onClick={() => handleNegotiationStyleChange(opt.key)}
                    onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && handleNegotiationStyleChange(opt.key)}
                    className={`border rounded-md p-3 cursor-pointer transition flex items-center gap-3 hover:shadow-md focus:ring-2 focus:ring-indigo-500 outline-none ${selected ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-gray-200'}`}
                    data-selected={selected}
                  >
                    <Icon className={`w-6 h-6 ${selected ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className="text-gray-700">{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              type="button"
              className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md"
              onClick={() => setStep(1)}
              disabled={savingStep2}
            >
              Back
            </button>
            <button
              type="button"
              className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold px-4 py-2 rounded-md flex items-center justify-center"
              onClick={handleStep2Submit}
              disabled={savingStep2}
            >
              {savingStep2 ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  Saving...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
          {step2Error && <div className="text-red-600 text-sm mt-2 text-center">{step2Error}</div>}
          {step2Success && <div className="text-green-600 text-sm mt-2 text-center">{step2Success}</div>}
        </div>
      )}
    </div>
  );
}
