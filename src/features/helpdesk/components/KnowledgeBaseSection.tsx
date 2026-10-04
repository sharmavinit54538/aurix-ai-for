import React, { useState, useEffect, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Loader2,
  HelpCircle,
  Laptop,
  Code,
  FileText,
  Banknote,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { helpdeskApi, getHelpdeskErrorMessage } from "../helpdeskApi";
import { HelpdeskEmptyState, HelpdeskErrorState, HelpdeskLoadingState } from "./HelpdeskStates";
import type { HelpdeskFaq } from "../types";

export function KnowledgeBaseSection({
  canManage = false,
}: {
  canManage?: boolean;
}) {
  const [faqs, setFaqs] = useState<HelpdeskFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Feedback local interaction tracking
  const [votedMap, setVotedMap] = useState<Record<string, "helpful" | "unhelpful">>({});

  // Admin New FAQ Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("IT");
  const [isSaving, setIsSaving] = useState(false);

  const loadFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await helpdeskApi.getFaqs();
      setFaqs(data);
    } catch (err) {
      setError(getHelpdeskErrorMessage(err, "Unable to load articles. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleVote = (id: string, type: "helpful" | "unhelpful") => {
    if (votedMap[id]) return;
    setVotedMap((prev) => ({ ...prev, [id]: type }));
    setFaqs((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            helpful_count: type === "helpful" ? (f.helpful_count || 0) + 1 : f.helpful_count,
            unhelpful_count: type === "unhelpful" ? (f.unhelpful_count || 0) + 1 : f.unhelpful_count,
          };
        }
        return f;
      })
    );
    toast.success("Thank you for your feedback!");
  };

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error("Question and answer are required");
      return;
    }

    setIsSaving(true);
    try {
      const created = await helpdeskApi.upsertFaq({
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
        category: newCategory,
      });
      setFaqs((prev) => [created, ...prev]);
      toast.success("Knowledge Base article published successfully");
      setNewQuestion("");
      setNewAnswer("");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(getHelpdeskErrorMessage(err, "Failed to publish article."));
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      if (selectedCategory !== "all" && faq.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesQ = faq.question.toLowerCase().includes(q);
        const matchesA = faq.answer.toLowerCase().includes(q);
        const matchesC = faq.category.toLowerCase().includes(q);
        if (!matchesQ && !matchesA && !matchesC) return false;
      }
      return true;
    });
  }, [faqs, search, selectedCategory]);

  // Categories present in real articles
  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => f.category && set.add(f.category));
    return Array.from(set);
  }, [faqs]);

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Knowledge Base & Self-Service
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search verified articles, policies, and standard procedures
          </p>
        </div>

        {canManage && (
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5 shrink-0">
            <Plus className="h-4 w-4" />
            Add Article
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base articles and solutions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs shrink-0"
              onClick={() => setSelectedCategory("all")}
            >
              All Articles
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory.toLowerCase() === cat.toLowerCase() ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs shrink-0 capitalize"
                onClick={() => setSelectedCategory(cat.toLowerCase())}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Articles Content */}
      {loading ? (
        <div className="py-16">
          <HelpdeskLoadingState message="Loading knowledge base articles..." />
        </div>
      ) : error ? (
        <HelpdeskErrorState title="Unable to load articles." error={error} onRetry={loadFaqs} />
      ) : filteredFaqs.length === 0 ? (
        <HelpdeskEmptyState
          title="No knowledge base articles available."
          description={
            search || selectedCategory !== "all"
              ? "No articles matched your search query. Try broadening your terms."
              : "No documentation has been published yet. Support staff will post solutions here."
          }
          action={
            canManage ? (
              <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Publish First Article
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-xs">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {filteredFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-border/80 rounded-lg px-4 bg-muted/10 hover:bg-muted/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline py-3.5">
                  <div className="flex items-center gap-2.5 pr-4">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>{faq.question}</span>
                    <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-muted text-muted-foreground ml-auto uppercase tracking-wider">
                      {faq.category}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 text-sm text-foreground/90 space-y-4 border-t border-border/40 mt-1">
                  <div className="whitespace-pre-wrap leading-relaxed">{faq.answer}</div>

                  {/* Feedback Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    <span>Was this article helpful?</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 px-2 text-xs gap-1 ${
                          votedMap[faq.id] === "helpful"
                            ? "text-emerald-600 bg-emerald-500/10 font-bold"
                            : "hover:text-foreground"
                        }`}
                        onClick={() => handleVote(faq.id, "helpful")}
                        disabled={Boolean(votedMap[faq.id])}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>Yes ({faq.helpful_count || 0})</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 px-2 text-xs gap-1 ${
                          votedMap[faq.id] === "unhelpful"
                            ? "text-rose-600 bg-rose-500/10 font-bold"
                            : "hover:text-foreground"
                        }`}
                        onClick={() => handleVote(faq.id, "unhelpful")}
                        disabled={Boolean(votedMap[faq.id])}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                        <span>No ({faq.unhelpful_count || 0})</span>
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Admin Publish Article Modal */}
      {canManage && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[540px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Publish Knowledge Base Article</DialogTitle>
              <DialogDescription>
                Provide a clear question and step-by-step resolution for employees to reference.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateFaq} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="faq-question">Question / Title</Label>
                <Input
                  id="faq-question"
                  placeholder="e.g. How do I configure company VPN on macOS?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  disabled={isSaving}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="faq-category">Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory} disabled={isSaving}>
                  <SelectTrigger id="faq-category">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT Support</SelectItem>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Software">Software & SaaS</SelectItem>
                    <SelectItem value="HR">HR Policies</SelectItem>
                    <SelectItem value="Payroll">Payroll</SelectItem>
                    <SelectItem value="Facilities">Facilities & Office</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="faq-answer">Resolution / Explanation</Label>
                <Textarea
                  id="faq-answer"
                  placeholder="Write clear steps, link to documentation, or explain policies..."
                  rows={5}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  disabled={isSaving}
                  required
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="gap-2">
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSaving ? "Publishing..." : "Publish Article"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
