import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Headphones, TicketCheck, HeartHandshake, HelpCircle,
  Plus, Info, RefreshCw, CheckCircle2, Sparkles, AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";

export const Route = createFileRoute("/dashboard/help")({
  head: () => ({ meta: [{ title: "Help Center — Aurix" }] }),
  component: HelpCenterPage,
});

function HelpCenterPage() {
  const ws = useAurix();
  const [activeTab, setActiveTab] = useState("desk");

  // Ticket states
  const [ticketCategory, setTicketCategory] = useState("IT Support");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) {
      toast.error("Please fill in subject and description.");
      return;
    }
    const nextId = "TKT-" + Math.floor(1000 + Math.random() * 9000);
    setTickets([
      ...tickets,
      { id: nextId, subject: ticketSubject, category: ticketCategory, date: new Date().toISOString().split("T")[0], status: "open" }
    ]);
    toast.success(`Support ticket ${nextId} raised successfully!`);
    setTicketSubject("");
    setTicketDesc("");
  };

  const employeeTabs = [
    { id: "desk", label: "Help Desk Support", icon: Headphones },
    { id: "raise-ticket", label: "Raise Support Ticket", icon: TicketCheck },
    { id: "support", label: "My Support Tickets", icon: HeartHandshake },
    { id: "faqs", label: "FAQs Support", icon: HelpCircle },
  ];

  return (
    <>
      <PageHeader
        title="IT & HR Help Center"
        description="Raise support tickets, browse FAQs guidelines, and coordinate support with IT operations."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          {employeeTabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active 
                    ? "bg-accent text-foreground" 
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </aside>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          {activeTab === "desk" && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold border-b pb-2">IT & Facilities Support Contacts</h3>
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="border bg-card/30 rounded-xl p-4 space-y-2">
                  <div className="font-semibold text-sm">IT Support Desk</div>
                  <div className="text-muted-foreground">Location: Floor 3, Bay A</div>
                  <div className="text-muted-foreground">Email: itsupport@aurix.ai</div>
                  <div className="text-muted-foreground">Hotline: Ext 101</div>
                </div>
                <div className="border bg-card/30 rounded-xl p-4 space-y-2">
                  <div className="font-semibold text-sm">Facilities & HR desk</div>
                  <div className="text-muted-foreground">Location: Floor 1, Reception</div>
                  <div className="text-muted-foreground">Email: hrops@aurix.ai</div>
                  <div className="text-muted-foreground">Hotline: Ext 105</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "raise-ticket" && (
            <form onSubmit={handleRaiseTicket} className="space-y-4 max-w-md text-xs">
              <h3 className="text-base font-semibold border-b pb-2 font-display">Log a New Support Ticket</h3>
              
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Ticket Category</Label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="IT Support">IT Support (Hardware/Software)</option>
                  <option value="Facilities">Facilities & Office Operations</option>
                  <option value="HR Queries">HR & Leaves Queries</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Subject Summary</Label>
                <Input
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Broken keyboard key / VPN login error"
                  className="bg-background/50 border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Detailed Description</Label>
                <textarea
                  required
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Provide logs details or instructions to reproduce the issue..."
                  className="w-full min-h-[100px] bg-background/50 border rounded-lg p-3 text-sm focus:ring-1"
                />
              </div>

              <Button type="submit">Submit Ticket</Button>
            </form>
          )}

          {activeTab === "support" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">My Support Requests</h3>
              {tickets.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No support tickets raised yet.
                </div>
              ) : (
                <Card className="border overflow-hidden">
                  <Table className="text-xs">
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="pl-6 py-4">Ticket ID</TableHead>
                        <TableHead className="py-4">Subject</TableHead>
                        <TableHead className="py-4">Category</TableHead>
                        <TableHead className="py-4">Logged Date</TableHead>
                        <TableHead className="pr-6 py-4">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((t) => (
                        <TableRow key={t.id} className="hover:bg-muted/5 transition-all">
                          <TableCell className="pl-6 py-4 font-semibold font-mono">{t.id}</TableCell>
                          <TableCell className="py-4">{t.subject}</TableCell>
                          <TableCell className="py-4 font-semibold">{t.category}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{t.date}</TableCell>
                          <TableCell className="pr-6 py-4">
                            <Badge variant="outline" className={`capitalize ${
                              t.status === "open" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : ""
                            }`}>{t.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="space-y-4 max-w-lg">
              <h3 className="text-base font-semibold border-b pb-2">Support FAQs</h3>
              <div className="space-y-3 text-xs">
                {[
                  { q: "How do I request a VPN access account?", a: "Submit an IT Support ticket under IT category specifying client deliverables needs." },
                  { q: "How long does IT hardware replacement take?", a: "Standard SLA replacement for keyboard/chargers is 24 hours. Laptops take 3 business days." }
                ].map((faq, idx) => (
                  <div key={idx} className="border border-border bg-card/30 rounded-xl p-4 space-y-1.5">
                    <div className="font-semibold text-sm text-indigo-400">{faq.q}</div>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
