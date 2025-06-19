import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Types for props
export interface SummaryProps {
  alignment: string;
  recommendation: string;
  strengths: string[];
  weaknesses: string[];
  negotiationPriorities: string[];
  candidateRole?: string;
  candidateLevel?: string;
  context?: string;
  dateGenerated: string;
}

export interface Clause {
  clause_type: string;
  status: string;
  rationale: string;
  recommendation: string;
  excerpt: string;
  source_document?: string;
  confidence?: number;
}

interface ContractAnalysisPDFProps {
  summary: SummaryProps;
  clauses: Clause[];
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  header: {
    borderBottom: '2px solid #222',
    marginBottom: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  meta: {
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1a202c',
  },
  alignment: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendation: {
    marginBottom: 8,
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  column: {
    flex: 1,
    paddingRight: 8,
  },
  bullet: {
    marginBottom: 2,
    marginLeft: 8,
  },
  numbered: {
    marginBottom: 2,
    marginLeft: 8,
  },
  clauseBox: {
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    padding: 8,
    marginBottom: 4,
  },
  clauseTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
  },
  clauseStatus: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  clauseRecommendation: {
    marginBottom: 2,
  },
  clauseMeta: {
    fontSize: 9,
    color: '#888',
    marginBottom: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 32,
    right: 32,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 8,
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
});

export const ContractAnalysisPDF: React.FC<ContractAnalysisPDFProps> = ({ summary, clauses }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Contract Analysis Summary</Text>
        <Text style={styles.subtitle}>Personalized review of your employment offer</Text>
        <Text style={styles.meta}>Date generated: {summary.dateGenerated}</Text>
        {(summary.candidateRole || summary.candidateLevel || summary.context) && (
          <Text style={styles.meta}>
            {summary.candidateRole ? `Role: ${summary.candidateRole}` : ''}
            {summary.candidateLevel ? ` | Level: ${summary.candidateLevel}` : ''}
            {summary.context ? ` | Context: ${summary.context}` : ''}
          </Text>
        )}
      </View>

      {/* Section 1: Overall Assessment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Overall Assessment</Text>
        <Text style={styles.alignment}>Alignment Rating: {summary.alignment}</Text>
        <Text style={styles.recommendation}>{summary.recommendation}</Text>
      </View>

      {/* Section 2: Strengths and Weaknesses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Strengths and Weaknesses</Text>
        <View style={styles.columns}>
          <View style={styles.column}>
            <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>✅ Key Strengths</Text>
            {summary.strengths && summary.strengths.length > 0 ? (
              summary.strengths.map((item, idx) => (
                <Text key={idx} style={styles.bullet}>• {item}</Text>
              ))
            ) : (
              <Text style={styles.bullet}>None listed.</Text>
            )}
          </View>
          <View style={styles.column}>
            <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>⚠ Areas for Improvement</Text>
            {summary.weaknesses && summary.weaknesses.length > 0 ? (
              summary.weaknesses.map((item, idx) => (
                <Text key={idx} style={styles.bullet}>• {item}</Text>
              ))
            ) : (
              <Text style={styles.bullet}>None listed.</Text>
            )}
          </View>
        </View>
      </View>

      {/* Section 3: Negotiation Priorities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Negotiation Priorities</Text>
        {summary.negotiationPriorities && summary.negotiationPriorities.length > 0 ? (
          summary.negotiationPriorities.map((item, idx) => (
            <Text key={idx} style={styles.numbered}>{idx + 1}. {item}</Text>
          ))
        ) : (
          <Text style={styles.numbered}>No priorities listed.</Text>
        )}
      </View>

      {/* Section 4: Clause-by-Clause Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Clause-by-Clause Analysis</Text>
        {clauses && clauses.length > 0 ? (
          clauses.map((clause, idx) => (
            <View key={idx} style={{ marginBottom: 10 }}>
              <Text style={styles.clauseTitle}>{clause.clause_type}</Text>
              <Text style={styles.clauseStatus}>Status: {clause.status}</Text>
              <Text style={styles.clauseRecommendation}>{clause.recommendation}</Text>
              <View style={styles.clauseBox}>
                <Text>{clause.excerpt}</Text>
              </View>
              <Text style={styles.clauseMeta}>
                {clause.source_document ? `Source: ${clause.source_document}` : ''}
                {typeof clause.confidence === 'number' ? ` | Confidence: ${Math.round(clause.confidence * 100)}%` : ''}
              </Text>
            </View>
          ))
        ) : (
          <Text>No clause analysis available.</Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text>Generated by Trusted • {summary.dateGenerated}</Text>
      </View>
    </Page>
  </Document>
);

export default ContractAnalysisPDF; 