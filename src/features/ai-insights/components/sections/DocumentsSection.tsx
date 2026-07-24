import { FileText } from "lucide-react";
import type { DocumentItem } from "@/store/aiInsights/aiInsightsTypes";
import { DocumentCard } from "../shared/DocumentCard";
import { EmptySection } from "../shared/EmptySection";
import { SectionTitle } from "../shared/SectionTitle";

export function DocumentsSection({ documents }: { documents: DocumentItem[] }) {
  console.log(documents);
  return (
    <>
      <SectionTitle eyebrow="Generate" title="AI Document Generator" icon={FileText} />
      {documents.length === 0 ? (
        <EmptySection message="No AI document templates configured." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {documents.map((document) => (
            <DocumentCard key={document.id ?? document.label} document={document} />
          ))}
        </div>
      )}
    </>
  );
}
