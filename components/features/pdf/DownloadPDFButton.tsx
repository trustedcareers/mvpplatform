"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ContractAnalysisPDF, {
  SummaryProps,
  Clause,
  ReviewerNote,
} from "./ContractAnalysisPDF";

interface DownloadPDFButtonProps {
  summary: SummaryProps;
  clauses: Clause[];
  reviewerNotes?: ReviewerNote[];
  fileName?: string;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({ summary, clauses, reviewerNotes, fileName = "contract-analysis.pdf" }) => {
  return (
    <PDFDownloadLink
      document={<ContractAnalysisPDF summary={summary} clauses={clauses} reviewerNotes={reviewerNotes} />}
      fileName={fileName}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
    >
      {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF Report')}
    </PDFDownloadLink>
  );
};

export default DownloadPDFButton; 