import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Loader2,
  Send,
  Paperclip,
  Clock,
  Shield,
  MessageSquare,
  FileText,
  UserCheck,
  History,
  Lock,
  Download,
  AlertTriangle,
} from "lucide-react";
import { HelpdeskStatusBadge, HelpdeskPriorityBadge, HelpdeskSlaBadge } from "./HelpdeskBadges";
import { HelpdeskEmptyState, HelpdeskErrorState, HelpdeskLoadingState } from "./HelpdeskStates";
import { getCategoryIcon, formatCategoryLabel, formatDate } from "./TicketTable";
import { helpdeskApi, getHelpdeskErrorMessage } from "../helpdeskApi";
import type {
  HelpdeskTicket,
  HelpdeskComment,
  HelpdeskStatus,
  HelpdeskPriority,
  HelpdeskAgent,
} from "../types";

interface TicketDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: string | null;
  currentUserRole?: string | null;
  currentUserId?: string | null;
  onTicketUpdated?: () => void;
}

export function TicketDetailModal({
  open,
  onOpenChange,
  ticketId,
  currentUserRole,
  currentUserId,
  onTicketUpdated,
}: TicketDetailModalProps) {
  const [ticket, setTicket] = useState<HelpdeskTicket | null>(null);
  const [comments, setComments] = useState<HelpdeskComment[]>([]);
  const [agents, setAgents] = useState<HelpdeskAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Internal Note state (Agents only)
  const [internalNote, setInternalNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Agent action state
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const isAgent =
    currentUserRole === "hr_admin" ||
    currentUserRole === "it_admin" ||
    currentUserRole === "admin";

  const isRequester = ticket && currentUserId && ticket.requester_id === currentUserId;

  // Load ticket and comments
  const loadTicketData = async () => {
    if (!ticketId) return;
    setLoading(true);
    setError(null);
    try {
      const [ticketData, commentsData] = await Promise.all([
        helpdeskApi.getTicketById(ticketId),
        helpdeskApi.getTicketComments(ticketId),
      ]);
      setTicket(ticketData);
      setComments(commentsData);

      // If user is agent, load assignable colleagues as well
      if (isAgent) {
        try {
          const agentsList = await helpdeskApi.getAssignableAgents();
          setAgents(agentsList);
        } catch {
          // Non-blocking
        }
      }
    } catch (err) {
      const msg = getHelpdeskErrorMessage(err, "Unable to load ticket details.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && ticketId) {
      loadTicketData();
    } else {
      setTicket(null);
      setComments([]);
      setReplyText("");
      setInternalNote("");
      setSelectedFile(null);
      setError(null);
    }
  }, [open, ticketId]);

  // Reply submit
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId || !replyText.trim()) return;

    setIsSendingReply(true);
    try {
      const attachmentUrls: string[] = [];
      if (selectedFile) {
        try {
          const uploadRes = await helpdeskApi.uploadAttachment(selectedFile);
          if (uploadRes.url) {
            attachmentUrls.push(uploadRes.url);
          }
        } catch (uploadErr) {
          toast.error("Failed to upload attachment with comment.");
        }
      }

      const newComment = await helpdeskApi.addTicketComment(ticketId, {
        content: replyText.trim(),
        attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      });

      setComments((prev) => [...prev, newComment]);
      setReplyText("");
      setSelectedFile(null);
      toast.success("Reply added to ticket");

      // Reload ticket status in case backend transitioned status to in_progress or waiting
      const updated = await helpdeskApi.getTicketById(ticketId);
      setTicket(updated);
      onTicketUpdated?.();
    } catch (err) {
      toast.error(getHelpdeskErrorMessage(err, "Failed to send reply."));
    } finally {
      setIsSendingReply(false);
    }
  };

  // Internal Note submit (Agent only)
  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId || !internalNote.trim()) return;

    setIsSavingNote(true);
    try {
      await helpdeskApi.addInternalNote(ticketId, {
        note: internalNote.trim(),
      });
      toast.success("Internal note added (visible only to agents)");
      setInternalNote("");

      // Reload comments/notes
      const commentsData = await helpdeskApi.getTicketComments(ticketId);
      setComments(commentsData);
    } catch (err) {
      toast.error(getHelpdeskErrorMessage(err, "Failed to add internal note."));
    } finally {
      setIsSavingNote(false);
    }
  };

  // Status Change
  const handleStatusChange = async (newStatus: HelpdeskStatus) => {
    if (!ticketId || !ticket || ticket.status === newStatus) return;

    setIsUpdatingStatus(true);
    try {
      const updated = await helpdeskApi.updateTicketStatus(ticketId, {
        status: newStatus,
        reason: `Status updated by ${currentUserRole || "agent"}`,
      });
      setTicket(updated);
      toast.success(`Ticket status updated to ${newStatus.replace("_", " ")}`);
      onTicketUpdated?.();
    } catch (err) {
      toast.error(getHelpdeskErrorMessage(err, "Failed to update status."));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Agent Assignment
  const handleAssignAgent = async (agentId: string) => {
    if (!ticketId) return;

    setIsAssigning(true);
    try {
      const updated = await helpdeskApi.assignTicket(ticketId, { agent_id: agentId });
      setTicket(updated);
      toast.success("Ticket reassigned successfully");
      onTicketUpdated?.();
    } catch (err) {
      toast.error(getHelpdeskErrorMessage(err, "Failed to assign ticket."));
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[780px] p-0 max-h-[92vh] overflow-hidden flex flex-col">
        {loading ? (
          <div className="py-24">
            <HelpdeskLoadingState message="Loading ticket conversation and history..." />
          </div>
        ) : error ? (
          <div className="p-8">
            <HelpdeskErrorState error={error} onRetry={loadTicketData} />
          </div>
        ) : ticket ? (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    #{ticket.ticket_number || ticket.id.slice(0, 8)}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    {getCategoryIcon(ticket.category)}
                    <span>{formatCategoryLabel(ticket.category)}</span>
                  </div>
                  <HelpdeskPriorityBadge priority={ticket.priority} />
                  <HelpdeskStatusBadge status={ticket.status} />
                  <HelpdeskSlaBadge slaStatus={ticket.sla_status} />
                </div>

                {/* Agent/Requester Quick Action */}
                <div className="flex items-center gap-2">
                  {isAgent && (
                    <Select
                      value={ticket.status}
                      onValueChange={(val) => handleStatusChange(val as HelpdeskStatus)}
                      disabled={isUpdatingStatus}
                    >
                      <SelectTrigger className="h-8 text-xs w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="waiting_on_employee">Pending Info</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {/* If requester and ticket is resolved, allow closing or reopening */}
                  {isRequester && !isAgent && ticket.status === "resolved" && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleStatusChange("closed")}
                        disabled={isUpdatingStatus}
                      >
                        Confirm Resolution
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs text-amber-600 border-amber-500/30"
                        onClick={() => handleStatusChange("in_progress")}
                        disabled={isUpdatingStatus}
                      >
                        Reopen Ticket
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Metadata */}
              <h2 className="text-lg font-bold text-foreground leading-snug">{ticket.title}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                <div>
                  <span className="text-muted-foreground/70">Requester:</span>{" "}
                  <strong className="text-foreground">{ticket.requester_name || "Employee"}</strong>
                  {ticket.requester_email && (
                    <span className="text-muted-foreground/60 ml-1">({ticket.requester_email})</span>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground/70">Submitted:</span>{" "}
                  <span className="text-foreground">{formatDate(ticket.created_at)}</span>
                </div>
                {ticket.assigned_agent_name ? (
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    <span>Assigned:</span>
                    <strong className="text-foreground">{ticket.assigned_agent_name}</strong>
                  </div>
                ) : (
                  <span className="italic text-muted-foreground/70">Unassigned</span>
                )}
              </div>
            </div>

            {/* Content Body: Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Ticket Initial Description */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Issue Description</span>
                  <span>{formatDate(ticket.created_at)}</span>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {ticket.description || "No description provided."}
                </p>

                {/* Attachments */}
                {ticket.attachment_urls && ticket.attachment_urls.length > 0 && (
                  <div className="pt-2 border-t border-border/50">
                    <span className="text-xs font-semibold text-muted-foreground block mb-1.5">
                      Attached Files:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ticket.attachment_urls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-background border border-border hover:bg-muted transition-colors text-primary"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          <span>Attachment {i + 1}</span>
                          <Download className="h-3 w-3 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Agent Assignment Bar if Agent */}
              {isAgent && (
                <div className="flex flex-wrap items-center justify-between p-3 rounded-lg border border-border/70 bg-card text-xs gap-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">Agent Assignment:</span>
                    <span className="text-muted-foreground">
                      {ticket.assigned_agent_name || "Currently unassigned"}
                    </span>
                  </div>
                  {agents.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={ticket.assigned_agent_id || ""}
                        onValueChange={handleAssignAgent}
                        disabled={isAssigning}
                      >
                        <SelectTrigger className="h-8 text-xs w-[160px]">
                          <SelectValue placeholder="Assign agent..." />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map((ag) => (
                            <SelectItem key={ag.id} value={ag.id}>
                              {ag.name} ({ag.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Tabs: Conversation & Ticket History */}
              <Tabs defaultValue="conversation" className="w-full">
                <TabsList className="grid grid-cols-2 w-[240px] h-8 p-0.5">
                  <TabsTrigger value="conversation" className="text-xs gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Messages ({comments.length})
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-xs gap-1.5">
                    <History className="h-3.5 w-3.5" />
                    Audit History
                  </TabsTrigger>
                </TabsList>

                {/* Conversation Tab */}
                <TabsContent value="conversation" className="space-y-4 pt-3">
                  {comments.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                      No replies yet. Use the message box below to post a response.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`p-3.5 rounded-xl border text-sm transition-colors ${
                            comment.is_internal
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100"
                              : "bg-card border-border text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">
                                {comment.author_name || "Support Staff"}
                              </span>
                              {comment.author_role && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal">
                                  {comment.author_role}
                                </Badge>
                              )}
                              {comment.is_internal && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1 bg-amber-500/20 text-amber-600 border-amber-500/40 font-semibold gap-1">
                                  <Lock className="h-2.5 w-2.5" /> Internal Note
                                </Badge>
                              )}
                            </div>
                            <span className="text-muted-foreground text-[11px]">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{comment.content}</p>
                          {comment.attachments && comment.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {comment.attachments.map((att, idx) => (
                                <a
                                  key={idx}
                                  href={att}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary underline flex items-center gap-1"
                                >
                                  <Paperclip className="h-3 w-3" />
                                  Attachment {idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Public Reply Composer */}
                  <form onSubmit={handleSendReply} className="pt-2 border-t border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground">
                        Post a Reply
                      </label>
                      {selectedFile && (
                        <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                          <Paperclip className="h-3 w-3" />
                          <span className="truncate max-w-[160px]">{selectedFile.name}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="text-muted-foreground hover:text-destructive text-xs ml-1"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                    <Textarea
                      placeholder="Type your response or question here..."
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      disabled={isSendingReply}
                      className="resize-none text-sm"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <label
                        htmlFor="reply-file-upload"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1 rounded border border-border hover:bg-muted/50 transition-colors"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        <span>Attach File</span>
                        <input
                          id="reply-file-upload"
                          type="file"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                          disabled={isSendingReply}
                        />
                      </label>

                      <Button
                        type="submit"
                        size="sm"
                        disabled={isSendingReply || !replyText.trim()}
                        className="gap-1.5"
                      >
                        {isSendingReply ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Send className="h-3.5 w-3.5" />
                        )}
                        Send Reply
                      </Button>
                    </div>
                  </form>

                  {/* Internal Note Box for Agents Only */}
                  {isAgent && (
                    <form onSubmit={handleAddInternalNote} className="pt-4 border-t border-dashed border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Add Internal Note (Staff only, hidden from requester)</span>
                      </div>
                      <Textarea
                        placeholder="Internal triage findings, diagnostic notes, or agent handover info..."
                        rows={2}
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        disabled={isSavingNote}
                        className="border-amber-500/30 focus-visible:ring-amber-500 text-sm"
                      />
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          size="sm"
                          variant="outline"
                          disabled={isSavingNote || !internalNote.trim()}
                          className="border-amber-500/40 hover:bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs"
                        >
                          {isSavingNote && <Loader2 className="h-3 w-3 animate-spin mr-1.5" />}
                          Save Internal Note
                        </Button>
                      </div>
                    </form>
                  )}
                </TabsContent>

                {/* Audit History Tab */}
                <TabsContent value="history" className="space-y-3 pt-3">
                  {ticket.history && ticket.history.length > 0 ? (
                    <div className="space-y-2">
                      {ticket.history.map((hist, i) => (
                        <div
                          key={hist.id || i}
                          className="p-3 rounded-lg border border-border bg-muted/10 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span className="font-semibold text-foreground">{hist.action}</span>
                            <span>{formatDate(hist.timestamp)}</span>
                          </div>
                          {hist.actor_name && (
                            <div className="text-muted-foreground">
                              By: <strong className="text-foreground">{hist.actor_name}</strong>
                            </div>
                          )}
                          {hist.previous_value && hist.new_value && (
                            <div className="text-muted-foreground">
                              Changed from <code className="text-foreground">{hist.previous_value}</code> to{" "}
                              <code className="text-primary font-semibold">{hist.new_value}</code>
                            </div>
                          )}
                          {hist.note && <p className="text-muted-foreground italic mt-0.5">{hist.note}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-border bg-card text-xs space-y-2">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-semibold text-foreground">Ticket Created</span>
                        <span>{formatDate(ticket.created_at)}</span>
                      </div>
                      <p className="text-muted-foreground">
                        Ticket was initiated by {ticket.requester_name || "Requester"} with status{" "}
                        <code className="text-primary font-semibold">{ticket.status}</code> and priority{" "}
                        <code className="font-semibold">{ticket.priority}</code>.
                      </p>
                      {ticket.updated_at && ticket.updated_at !== ticket.created_at && (
                        <div className="pt-2 border-t border-border flex items-center justify-between text-muted-foreground">
                          <span className="font-semibold text-foreground">Last Audit Update</span>
                          <span>{formatDate(ticket.updated_at)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="p-8">
            <HelpdeskEmptyState title="Ticket Not Found" description="The requested ticket could not be found." />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
