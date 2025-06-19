"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ContractAnalysisPDF, {
  SummaryProps,
  Clause,
} from "./ContractAnalysisPDF";

interface DownloadPDFButtonProps {
  summary: SummaryProps;
  clauses: Clause[];
  fileName?: string;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({ summary, clauses, fileName = "contract-analysis.pdf" }) => {
  return (
    <PDFDownloadLink
      document={<ContractAnalysisPDF summary={summary} clauses={clauses} />}
      fileName={fileName}
      style={{
        display: "inline-block",
        padding: "8px 16px",
        backgroundColor: "#2563eb",
        color: "#fff",
        borderRadius: 4,
        fontWeight: 600,
        textDecoration: "none",
        fontSize: 14,
        border: "none",
        cursor: "pointer",
      }}
    >
      {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
    </PDFDownloadLink>
  );
};

export default DownloadPDFButton; 