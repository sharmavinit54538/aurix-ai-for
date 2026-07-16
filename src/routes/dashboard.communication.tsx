import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  MessageCircle, Bell, ScrollText, Users, Building2, MessageSquare,
  Sparkles, Send, Plus, Info, RefreshCw, CheckCircle2, UserCheck
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
import { api } from "@/api";

export const Route = createFileRoute("/dashboard/communication")({
  head: () => ({ meta: [{ title: "Communication — Aurix" }] }),
  component: CommunicationPage,
});

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

function CommunicationPage() {
  const ws = useAurix();
  const [activeTab, setActiveTab] = useState("announcements");

  const meEmployee = useMemo(() => {
    return ws.employees.find(emp => emp.email === ws.user?.email);
  }, [ws.employees, ws.user]);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loadingFeeds, setLoadingFeeds] = useState(false);

  // Chat message state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);

  // Channel team-chat messages
  const [channelInput, setChannelInput] = useState("");
  const [channelMessages, setChannelMessages] = useState<ChatMessage[]>([]);

  const loadFeeds = async () => {
    setLoadingFeeds(true);
    try {
      const annRes = await api.get<any>("/announcements?status=PUBLISHED");
      if (annRes?.success && annRes.data) {
        setAnnouncements(annRes.data);
      }
      
      const newsRes = await api.get<any>("/news?status=PUBLISHED");
      if (newsRes?.success && newsRes.data) {
        setNews(newsRes.data);
      }
    } catch (err) {
      console.error("Error loading feeds", err);
    } finally {
      setLoadingFeeds(false);
    }
  };

  const startChatbotSession = async () => {
    if (sessionId) return;
    try {
      const res = await api.post<any>("../../v2/emotions/sessions", {
        employeeId: meEmployee?.employeeId || "AUR-EMP-0105"
      });
      if (res?.success && res.data) {
        setSessionId(res.data.session_id);
        setChatMessages([
          { 
            sender: "AI Assistant", 
            text: "Hello! I am your AI Emotion-Aware assistant. How are you feeling today?", 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to start chatbot session", err);
    }
  };

  useEffect(() => {
    loadFeeds();
  }, []);

  useEffect(() => {
    if (activeTab === "chat") {
      startChatbotSession();
    }
  }, [activeTab]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !sessionId) return;
    const userMsg = chatInput;
    setChatInput("");
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: "You", text: userMsg, time: timeStr }]);

    try {
      const res = await api.post<any>(`../../v2/emotions/sessions/${sessionId}/messages`, {
        message: userMsg
      });
      if (res?.success && res.data) {
        setDetectedEmotion(res.data.detected_emotion);
        setChatMessages(prev => [
          ...prev,
          { 
            sender: "AI Assistant", 
            text: res.data.reply_text, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to send chatbot message", err);
      toast.error("Failed to compile chatbot reply.");
    }
  };

  const handleSendChannelMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) return;
    setChannelMessages([
      ...channelMessages,
      { sender: "You", text: channelInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChannelInput("");
  };

  const colleagues = useMemo(() => {
    const myDept = meEmployee?.department || "";
    return ws.employees.filter(emp => emp.department === myDept && emp.id !== ws.user?.id);
  }, [ws.employees, ws.user, meEmployee]);

  const companyHeads = useMemo(() => {
    return ws.managers.map(m => ({
      dept: m.department,
      head: m.fullName,
      email: m.email
    }));
  }, [ws.managers]);

  const employeeTabs = [
    { id: "announcements", label: "Announcements", icon: Bell, count: announcements.length || undefined },
    { id: "notice-board", label: "Notice Board", icon: ScrollText, count: news.length || undefined },
    { id: "team-directory", label: "Team Directory", icon: Users },
    { id: "company-directory", label: "Company Directory", icon: Building2 },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "team-chat", label: "Team Chat", icon: MessageCircle },
  ];

  return (
    <>
      <PageHeader
        title="Communication Center"
        description="Stay connected with your team, read announcements, view directory list, or message coworkers."
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
                <span className="flex-1 text-left">{t.label}</span>
                {t.count && (
                  <Badge variant="destructive" className="h-4 w-4 grid place-content-center p-0 text-[9px]">
                    {t.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </aside>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          {activeTab === "announcements" && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold border-b pb-2">Company Announcements</h3>
              {loadingFeeds ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Loading announcements...
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No company announcements published yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((item, i) => (
                    <div key={i} className="border border-border bg-card/30 rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-sm">{item.title}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-[10px]">
                            {item.publish_date}
                          </span>
                          {item.priority === "URGENT" && <Badge variant="destructive">Urgent</Badge>}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "notice-board" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Notice Board</h3>
              {loadingFeeds ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Loading notices...
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No notices posted on the board yet.
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {news.map((item, i) => (
                    <div key={i} className="border bg-card/30 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-sm">{item.headline}</div>
                        <div className="text-muted-foreground mt-0.5">{item.summary}</div>
                      </div>
                      <Badge variant="outline">{item.category || "General"}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "team-directory" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">My Department Colleagues</h3>
              {colleagues.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No department colleagues found.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  {colleagues.map((emp) => (
                    <div key={emp.id} className="border bg-card/30 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">{emp.fullName}</div>
                        <div className="text-muted-foreground mt-0.5">{emp.designation || "Engineer"}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">{emp.email}</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => { setActiveTab("chat"); }}>Chat</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "company-directory" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Company Department Heads</h3>
              {companyHeads.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No department heads listed.
                </div>
              ) : (
                <Card className="border overflow-hidden">
                  <Table className="text-xs">
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="pl-6 py-4">Department</TableHead>
                        <TableHead className="py-4">Head of Department</TableHead>
                        <TableHead className="pr-6 py-4 text-right">Contact Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companyHeads.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="pl-6 py-4 font-semibold">{item.dept}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{item.head}</TableCell>
                          <TableCell className="pr-6 py-4 text-right font-mono">{item.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="flex flex-col h-[400px] text-xs">
              <div className="border-b pb-2 flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-base font-semibold">AI Emotion-Aware Assistant</h3>
                  {detectedEmotion && (
                    <div className="text-[10px] text-indigo-400 mt-0.5">Classified Emotion: <span className="font-semibold uppercase">{detectedEmotion}</span></div>
                  )}
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Active Session</Badge>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                    <div className={`p-3 rounded-2xl max-w-[80%] ${
                      msg.sender === "You" 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-muted text-foreground rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-muted-foreground mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="How are you feeling today? (e.g. feeling stressed)..."
                  className="bg-background/50 border"
                />
                <Button type="submit"><Send className="h-4 w-4" /></Button>
              </form>
            </div>
          )}

          {activeTab === "team-chat" && (
            <div className="flex flex-col h-[400px] text-xs">
              <div className="border-b pb-2 flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold">Channel: #engineering-general</h3>
                <Badge variant="outline">General Broadcast</Badge>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                {channelMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] text-muted-foreground mb-0.5 px-1">{msg.sender}</span>
                    <div className={`p-3 rounded-2xl max-w-[80%] ${
                      msg.sender === "You" 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-muted text-foreground rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-muted-foreground mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                {channelMessages.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
                    No messages broadcast in channel #engineering-general yet.
                  </div>
                )}
              </div>

              <form onSubmit={handleSendChannelMsg} className="flex gap-2">
                <Input
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  placeholder="Broadcast message to channel..."
                  className="bg-background/50 border"
                />
                <Button type="submit"><Send className="h-4 w-4" /></Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
