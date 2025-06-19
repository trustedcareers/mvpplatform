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

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({
  summary,
  clauses,
  reviewerNotes,
  fileName = "contract-analysis.pdf",
}) => {
  // Use state to track if we're in browser
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on server or until client is ready
  if (!isClient) {
    return (
      <button
        disabled
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium opacity-50"
      >
        Preparing Download...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <ContractAnalysisPDF
          summary={summary}
          clauses={clauses}
          reviewerNotes={reviewerNotes}
        />
      }
      fileName={fileName}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50"
    >
      {({ loading, error }) =>
        loading ? "Preparing PDF..." : error ? "Error" : "Download PDF Report"
      }
    </PDFDownloadLink>
  );
};

export default DownloadPDFButton; 