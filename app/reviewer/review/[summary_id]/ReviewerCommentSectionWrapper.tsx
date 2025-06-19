"use client";
import ReviewerCommentSection from './ReviewerCommentSection';

export default function ReviewerCommentSectionWrapper({ prebriefId }: { prebriefId: string }) {
  return <ReviewerCommentSection prebriefId={prebriefId} />;
} 