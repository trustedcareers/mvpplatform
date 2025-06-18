"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

const LEVELS = ["entry", "mid", "senior", "exec"];
const SITUATIONS = ["laid off", "offer in hand", "exploring"];
const PRIORITIES = ["equity", "comp", "growth", "stability"];

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

  if (loadingData) {
    return (
      <div className="max-w-md mx-auto text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {existingProfile && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Updating Your Profile</h3>
          <p className="text-blue-700 text-sm">
            We found your existing profile. Make any changes below and click "Update Profile" to save.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role Title</label>
          <input 
            {...register("role_title", { required: true })} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="e.g. Senior Software Engineer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select {...register("level", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select your level...</option>
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl.charAt(0).toUpperCase() + lvl.slice(1)}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <input 
            {...register("industry", { required: true })} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="e.g. Technology, Finance, Healthcare"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Situation</label>
          <select {...register("situation", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select your situation...</option>
            {SITUATIONS.map((sit) => (
              <option key={sit} value={sit}>{sit.charAt(0).toUpperCase() + sit.slice(1)}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Base Salary</label>
            <input 
              type="number" 
              {...register("target_comp_base", { required: true })} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="150000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Total Comp</label>
            <input 
              type="number" 
              {...register("target_comp_total", { required: true })} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="200000"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Priorities</label>
          <div className="grid grid-cols-2 gap-2">
            {PRIORITIES.map((priority) => (
              <label key={priority} className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50">
                <input 
                  type="checkbox" 
                  value={priority} 
                  {...register("priorities")} 
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm capitalize">{priority}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confidence in Negotiation (1-5)
          </label>
          <Controller
            name="confidence_rating"
            control={control}
            defaultValue={3}
            render={({ field }) => (
              <div>
                <input 
                  type="range" 
                  min={1} 
                  max={5} 
                  {...field} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 (Low)</span>
                  <span className="font-medium text-blue-600">{confidenceRating}</span>
                  <span>5 (High)</span>
                </div>
              </div>
            )}
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </span>
          ) : (
            existingProfile ? "Update Profile" : "Create Profile"
          )}
        </button>
        
        {result && (
          <div className={`text-center mt-4 p-3 rounded-md ${
            result.includes('Error') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {result}
          </div>
        )}
      </form>
    </div>
  );
}
