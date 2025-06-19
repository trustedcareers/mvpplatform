"use client";

import dynamic from 'next/dynamic';
import { SummaryProps, Clause, ReviewerNote } from '@/components/features/pdf/ContractAnalysisPDF';

const DownloadPDFButton = dynamic(
  () => import('@/components/features/pdf/DownloadPDFButton'),
  { ssr: false }
);

interface PDFButtonWrapperProps {
  summary: SummaryProps;
  clauses: Clause[];
  reviewerNotes?: ReviewerNote[];
}

export default function PDFButtonWrapper({ summary, clauses, reviewerNotes }: PDFButtonWrapperProps) {
  return (
    <div className="mb-4">
      <DownloadPDFButton
        summary={summary}
        clauses={clauses}
        reviewerNotes={reviewerNotes}
        fileName="contract-analysis.pdf"
      />
    </div>
  );
} 