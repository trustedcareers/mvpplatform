# Trusted - AI-Powered Job Offer Analysis Platform

**Trusted** is a job offer evaluation platform that blends AI-powered document analysis, a standardized knowledge base, and human review to help professionals make smarter, more confident career decisions.

## 🚀 Quick Start

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or whatever port is shown in terminal) with your browser.

**Current Status:** Core analysis system is functional with personalized contract analysis, clause-by-clause breakdown, database storage, and PDF export working end-to-end.

---

# ✅ Trusted MVP – Holistic Task Breakdown

This document maps the PRD into clear, scoped tasks with priorities, dependencies, and estimates. Tasks span infrastructure, features, UI, security, testing, and documentation for MVP (Phase 1), and preview key enhancements in Phases 2 and 3.

---

## 📘 Product Overview

**Trusted** is a job offer evaluation platform that blends AI-powered document analysis, a standardized knowledge base, and human review to help professionals make smarter, more confident career decisions. Users upload their job offers, receive a personalized and visually structured report that outlines risks, opportunities, and negotiation framing—all tailored to their goals and context.

**Problem it solves:** Offers are often vague, incomplete, or hard to evaluate. Traditional legal review is expensive and generic. Trusted fills this gap with fast, personalized, and strategic insights.

**Target Users:**

* Professionals in transition (offer in hand, laid off, pivoting)
* First-time executives or new to equity compensation
* High-cash earners weighing long-term upside
* Career coaches supporting candidates through negotiation

**Core Value Props:**

* Know what's in your offer—and what's missing
* Understand how it compares to the market
* Receive framing and next steps customized to your situation
* Feel confident, clear, and in control

---

## 🔑 Core Features

1. **Contextual Intake Form** – Captures user's role, level, goals, and compensation targets. Used to personalize AI outputs and final reports.
2. **Multi-Document Upload** – Accepts offers, job descriptions, recruiter emails, and more. Categorized and stored securely.
3. **OpenAI GPT Integration** – Runs clause tagging and checklist comparison with user context and uploaded docs.
4. **Knowledge Base** – Provides role/seniority-specific checklist of expected clauses.
5. **Pre-Brief Generator** – Produces reviewer-facing summary of risks, missing terms, and talking points.
6. **Human Review + Notes** – Trusted reviewer annotates pre-brief with commentary, framing, and priority recommendations.
7. **Final PDF Report** – Clean, structured, user-facing document based on AI + reviewer input.

---

## 🧱 Technical Architecture

* **Frontend:** Next.js App Router, Tailwind (v4) ✅ **IMPLEMENTED**
* **Logic:** Cursor handles prompts and routing ✅ **IMPLEMENTED**
* **AI:** OpenAI GPT (for clause tagging, gap detection, rationale generation) ✅ **IMPLEMENTED**
* **Backend:** Supabase (Auth, DB, Storage) ✅ **IMPLEMENTED**
* **Reviewer Tooling:** Reviewer dashboard with comments and feedback system ✅ **IMPLEMENTED AND ENHANCED**
* **PDF Generation:** Professional PDF export using @react-pdf/renderer ✅ **IMPLEMENTED**

---

## 🔁 Notes on Replacing Claude with OpenAI GPT

All AI processing now routes through OpenAI GPT APIs. This includes:

* `analyzeContract()` → parse and tag clauses ✅ **IMPLEMENTED AND OPTIMIZED**
* `checkCompleteness()` → compare against KB ✅ **IMPLEMENTED** 
* `explainClause()` → rationale for red flags ✅ **IMPLEMENTED**

Prompt templates and anonymization have been updated accordingly.

---

## 🛠️ MVP Task Details (with Full Descriptions)

### 1. Infrastructure

* **MVP-INFRA-001:** Set up Next.js App Router with Tailwind (4h) ✅ **COMPLETED**
  Initialize a Next.js app using the App Router structure and configure Tailwind for styling.

* **MVP-INFRA-002:** Configure Supabase Integration (8h) ✅ **COMPLETED**
  Set up Supabase project, tables, RLS policies, and client connection via environment variables.

### 2. Features

* **MVP-FEAT-001:** Implement Contextual Intake Form (16h) ✅ **COMPLETED**
  Build form with fields for role, level, situation, compensation targets, priorities. Save to Supabase.

* **MVP-FEAT-002:** Multi-Document Upload System (20h) ✅ **COMPLETED**
  Allow users to upload multiple categorized PDFs (e.g. offer, JD, emails). Store metadata + files in Supabase.

* **MVP-FEAT-003:** Integrate OpenAI GPT for Document Analysis (24h) ✅ **COMPLETED**
  After upload, generate prompt with user context and doc content. Parse response into clause tags and store in `review_results`.

* **MVP-FEAT-004:** Role-Specific Knowledge Base (12h) 🟡 **PARTIAL - Built into prompts**
  Create static JSON defining expected clauses per role/seniority level. Used for completeness check and report generation.

* **MVP-FEAT-005:** Pre-Brief Generator (16h) ✅ **COMPLETED - Integrated into analysis**
  Create a summary that includes top flagged clauses, missing terms, and key issues for reviewers.

* **MVP-FEAT-006:** Report Generation System (20h) ✅ **COMPLETED**
  Combine AI and human inputs into structured output. Render as web view and export to PDF.

* **MVP-FEAT-007:** Reviewer Dashboard MVP (12h) ✅ **COMPLETED AND ENHANCED**
  Full-featured dashboard for reviewers with:
  - Review list with status and metrics
  - Pre-brief viewing and editing with real-time updates
  - Enhanced comment system with coaching angles
  - PDF export functionality with improved styling
  - Visit `/reviewer/dashboard` to access

* **MVP-FEAT-008:** Personalization Logic for Report Prioritization (12h) ✅ **COMPLETED**
  Use intake data to reorder or highlight sections of the final report based on user goals.

* **MVP-FEAT-009:** Styled Report Template Builder (16h) ✅ **COMPLETED**
  Apply clean layout with visual tags, summaries, and consistent branding to match user-facing reports.

### 3. UI

* **MVP-UI-001:** Mobile-Friendly Upload UI (16h) ✅ **COMPLETED**
  Responsive drag-and-drop uploader with type selection, upload status, and error handling.

* **MVP-UI-002:** Report Viewer Interface (12h) ✅ **COMPLETED AND ENHANCED**
  Web-based version of the report for users to read and optionally download as PDF.

### 4. Security

* **MVP-SEC-001:** Document Retention Policy (8h) ❌ **TODO**
  Auto-delete documents 30 days after upload or flag for archiving.

* **MVP-SEC-002:** Data Anonymization for OpenAI GPT (12h) ❌ **TODO**
  Strip names, email addresses, and other PII from documents before sending to OpenAI.

### 5. Testing

#### Testing Approach for MVP-FEAT-001: Contextual Intake Form ✅ **COMPLETED**

* **Objective:** Verify form captures and stores user inputs correctly.
* **Status:** Working end-to-end with user context successfully saving and being used in analysis

#### Testing Approach for MVP-FEAT-002: Multi-Document Upload ✅ **COMPLETED**

* **Objective:** Ensure file uploads are stored properly and metadata is saved.
* **Status:** PDF upload, text extraction, and metadata storage all working correctly

* **MVP-TEST-001:** Test Suite for Document Upload + Validation (16h) ❌ **TODO**
  Cover file validation, size limits, duplicate handling, and metadata saves.

* **MVP-TEST-002:** AI Analysis Validation Tests (12h) ❌ **TODO**
  Ensure OpenAI response parsing is consistent. Handle malformed outputs.

* **MVP-TEST-003:** Persona QA Pass for Report Alignment (8h) ❌ **TODO**
  Test reports against specific personas (e.g. exec, consultant, career switcher) for tone, framing, and clarity.

### 6. Documentation

* **MVP-DOC-001:** API Docs (8h) ❌ **TODO**
  Internal API surface including Supabase tables, AI functions, and auth flows.

* **MVP-DOC-002:** User Guide (12h) 🟡 **PARTIAL - VALIDATION_GUIDE.md exists**
  Walkthrough of uploading, reading reports, and interpreting common clauses.

---

## 🎯 Current Status Summary

**✅ CORE SYSTEM WORKING:**
- User intake form with personalized context
- PDF upload and text extraction with improved error handling
- OpenAI GPT analysis with optimized clause-by-clause breakdown
- Enhanced personalized summary with "Should I take this?" recommendations
- Robust database storage in both `review_results` and `review_summary` tables
- Web-based report viewer with polished styling and responsive design
- Professional PDF export with reviewer comments and improved formatting
- Full reviewer dashboard with real-time feedback system and enhanced UI components

**🟡 NEXT PRIORITIES:**
- Implement data anonymization for privacy
- Add comprehensive test suite
- Complete API documentation
- Implement document retention policies

**❌ FUTURE ENHANCEMENTS:**
- Additional role templates in knowledge base
- Enhanced analytics dashboard
- Batch processing capabilities

---

## 📚 Knowledge Base Coverage

> **Note:** The current knowledge base (`lib/contractKnowledgeBase.json`) only includes the roles and seniority levels provided so far (e.g., Software Engineer, Product Manager, etc.).
>
> For broader or more accurate completeness checks and report generation, you should add more roles and levels to this file as needed. Each entry should follow the same JSON structure.

---

## 🚀 Getting Started for Development

1. **Environment Setup:**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Add your API keys:
   # OPENAI_API_KEY=your_openai_key
   # NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Database Setup:**
   - Run the SQL migrations in `supabase/migrations/`
   - Ensure all tables exist: `user_context`, `contract_documents`, `review_results`, `review_summary`, `review_prebrief`

3. **Start Development:**
   ```bash
   npm run dev
   ```

4. **Test the System:**
   - Visit `/intake` to create user profile
   - Upload a contract PDF at `/upload`
   - Run analysis at `/debug/analyze`  
   - View results at `/review-summary`

See `VALIDATION_GUIDE.md` for detailed testing instructions.

## Future Steps

- For production, restrict the RLS policy on the `review_prebrief` table to only allow users to read their own rows:
  - Policy: `user_id = auth.uid()`
  - This ensures only authenticated users can access their own prebriefs.
  - Implement this before going live.

## Reviewer Dashboard & Report Features

### Features
- **Reviewer Dashboard** (`/reviewer/dashboard`):
  - Displays a table of all review summaries, merged with user context (role title, level, industry, situation, priorities).
  - Each row links to a detailed report page for that review.
- **Report Page** (`/reviewer/review/[summary_id]`):
  - Shows all fields from the `review_summary` table for the selected review.
  - Strengths and Opportunities are shown as bulleted lists.
  - Negotiation Priorities are shown as a numbered list, immediately after Recommendation.
  - All fields are clearly labeled and formatted for readability.
- **Prebrief Section:**
  - The prebrief (executive summary) is generated by AI during analysis and saved to the `review_prebrief` table.
  - The prebrief is editable inline by reviewers. Edits are upserted per user (using a unique constraint on `user_id`).
  - The prebrief is displayed at the top of the reviewer report page.

### Setup & Environment
- Requires the following environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only, for fetching users from `auth.users`)
- **Supabase Table Requirements:**
  - `review_summary` table with all relevant fields (see schema).
  - `user_context` table with user context fields, linked by `user_id`.
  - `auth.users` table (managed by Supabase Auth).
- **RLS Policies:**
  - `user_context` must have a read policy allowing the app to fetch rows (e.g., `using (true)` for dev, or `auth.uid() = user_id` for production).

### Usage
- Visit `/reviewer/dashboard` to see all reviews and user context.
- Click "View Report" to see a detailed report for a review.
- The report page displays:
  - Status, Alignment Rating, Alignment Explanation, Confidence Score, Recommendation
  - Negotiation Priorities (numbered list)
  - Strengths and Opportunities (bulleted lists)
  - Created/Updated timestamps

### Extending or Debugging
- To add more fields, update the dashboard and report page components.
- If fields do not display, check RLS policies and data in Supabase.
- Debug panels can be temporarily re-enabled in the dashboard for troubleshooting.

---

## 📄 PDF Export Feature

The platform now supports professional PDF exports of contract analysis reports. Key features include:

1. **Structured Layout:**
   - Title and context information
   - Overall assessment with alignment rating
   - Strengths and weaknesses analysis
   - Negotiation priorities
   - Clause-by-clause breakdown
   - Reviewer comments and coaching angles

2. **Export Options:**
   - Available from both user report and reviewer pages
   - Includes all reviewer comments and feedback
   - Professional styling with consistent branding
   - Client-side generation for privacy

3. **Technical Implementation:**
   - Built with @react-pdf/renderer
   - Client-side rendering for better performance
   - Responsive to screen sizes
   - Proper loading states and error handling

---
