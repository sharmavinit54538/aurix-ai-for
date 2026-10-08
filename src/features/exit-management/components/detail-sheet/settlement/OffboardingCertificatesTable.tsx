import { Eye, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { statusBadgeClass } from "@/lib/status-styles";
import { toast } from "sonner";
import type { ExitCase } from "../../../types";

interface OffboardingCertificatesTableProps {
  detailCase: ExitCase;
  onPreviewLetter: (exit: ExitCase, docName: string) => void;
  onGenerateDoc: (exit: ExitCase, docName: string) => void;
}

export function OffboardingCertificatesTable({
  detailCase,
  onPreviewLetter,
  onGenerateDoc,
}: OffboardingCertificatesTableProps) {
  return (
    <div className="space-y-2 text-left">
      <Label className="text-xs font-semibold text-muted-foreground">
        Auto-generated offboarding certificates
      </Label>
      <div className="rounded-xl border border-border bg-card p-0 overflow-hidden">
        <Table className="text-xs border-collapse">
          <TableHeader className="bg-muted/10 border-b border-border">
            <TableRow>
              <TableHead className="px-3 py-2 w-[220px]">Certificate Title</TableHead>
              <TableHead className="px-3 py-2">Generation Status</TableHead>
              <TableHead className="px-3 py-2 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detailCase.documents.map((doc) => (
              <TableRow key={doc.name} className="border-t border-border">
                <TableCell className="px-3 py-2 font-bold">{doc.name}</TableCell>
                <TableCell className="px-3 py-2">
                  {doc.issued ? (
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${statusBadgeClass("approved")}`}
                    >
                      Issued & Signed
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${statusBadgeClass("warning")}`}
                    >
                      Not Generated
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onPreviewLetter(detailCase, doc.name)}
                      className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Preview template text"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    {!doc.issued ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onGenerateDoc(detailCase, doc.name)}
                        className="h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-muted"
                      >
                        Generate
                      </Button>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          toast.success(
                            `Sent PDF document to ${detailCase.employee}'s personal email.`,
                          );
                        }}
                        className="h-6 w-6 text-primary hover:bg-primary/10 cursor-pointer"
                        title="Email PDF to employee"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
