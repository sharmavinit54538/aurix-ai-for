import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays, Palmtree, Star, Video,
  Plus, Info, RefreshCw, CheckCircle2, Sparkles, Video as VideoIcon
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

export const Route = createFileRoute("/dashboard/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Aurix" }] }),
  component: CalendarPage,
});

interface Holiday {
  name: string;
  date: string;
  day: string;
}

const UPCOMING_HOLIDAYS: Holiday[] = [
  { name: "Independence Day", date: "2026-07-04", day: "Saturday" },
  { name: "Labor Day", date: "2026-09-07", day: "Monday" },
  { name: "Thanksgiving Day", date: "2026-11-26", day: "Thursday" }
];

function CalendarPage() {
  const ws = useAurix();
  const [activeTab, setActiveTab] = useState("company");

  // Meeting schedule states
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetings, setMeetings] = useState<any[]>([
    { title: "Weekly Engineering Sync", date: "2026-07-16", time: "2:00 PM - 3:00 PM", link: "https://meet.google.com/abc-defg-hij" },
    { title: "Project Demo & Review", date: "2026-07-17", time: "11:00 AM - 11:30 AM", link: "https://meet.google.com/xyz-pqrs-uvw" }
  ]);

  // Interactive Monthly Calendar Grid state
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Default to July 2026
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-16");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysArray.push(d);
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getCellDateString = (day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  interface CalendarItem {
    type: string;
    name: string;
    date: string;
    info: string;
    time?: string;
    link?: string;
  }

  const calendarItems: CalendarItem[] = [
    // Holidays
    { type: "holiday", name: "Independence Day", date: "2026-07-04", info: "National Holiday" },
    { type: "holiday", name: "Labor Day", date: "2026-09-07", info: "National Holiday" },
    { type: "holiday", name: "Thanksgiving Day", date: "2026-11-26", info: "National Holiday" },
    // Events
    { type: "event", name: "Q3 Corporate Town Hall Meeting", date: "2026-07-20", time: "4:00 PM - 5:30 PM", info: "Global updates from the leadership team." },
    { type: "event", name: "Design System Migration Sync", date: "2026-07-22", time: "2:00 PM - 3:00 PM", info: "Alignment check for design tokens updates." }
  ];

  const allItems: CalendarItem[] = [
    ...calendarItems,
    ...meetings.map(m => ({ type: "meeting", name: m.title, date: m.date, time: m.time, info: `${m.time} | Join Link Available`, link: m.link }))
  ];

  const generateMeetLink = () => {
    // Return Google Meet 'Start New' Link which automatically creates a real, active meeting room on click
    return "https://meet.google.com/new";
  };

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim() || !meetingDate || !meetingTime) {
      toast.error("Please fill in meeting details.");
      return;
    }
    setMeetings([
      ...meetings,
      { title: meetingTitle, date: meetingDate, time: meetingTime, link: generateMeetLink() }
    ]);
    toast.success("Meeting scheduled successfully!");
    setMeetingTitle("");
    setMeetingDate("");
    setMeetingTime("");
  };

  const employeeTabs = [
    { id: "company", label: "Company Calendar", icon: CalendarDays },
    { id: "holidays", label: "Holidays", icon: Palmtree },
    { id: "events", label: "Events", icon: Star },
    { id: "meetings", label: "Meetings", icon: Video },
  ];

  return (
    <>
      <PageHeader
        title="Schedule & Calendars"
        description="Check upcoming company holidays, view and schedule corporate meetings, or track team events."
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
          {activeTab === "company" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-semibold">Interactive Company Calendar</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>&lt; Prev</Button>
                  <span className="text-sm font-semibold min-w-[120px] text-center">{monthNames[month]} {year}</span>
                  <Button variant="outline" size="sm" onClick={nextMonth}>Next &gt;</Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-medium text-xs text-muted-foreground mb-2">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {daysArray.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square rounded-lg bg-accent/10 opacity-30" />;
                  }

                  const dateStr = getCellDateString(day);
                  const dayItems = allItems.filter(item => item.date === dateStr);
                  const isSelected = selectedDateStr === dateStr;

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`relative aspect-square flex flex-col items-center justify-between p-1.5 rounded-xl border text-xs transition-all hover:bg-accent/40 ${
                        isSelected 
                          ? "bg-accent/80 border-primary text-foreground font-bold shadow-sm" 
                          : "bg-background/20 border-border text-muted-foreground"
                      }`}
                    >
                      <span className="self-start font-semibold">{day}</span>
                      <div className="flex gap-0.5 justify-center w-full mt-auto">
                        {dayItems.map((item, i) => (
                          <span
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.type === "holiday" 
                                ? "bg-rose-500" 
                                : item.type === "event" 
                                ? "bg-blue-500" 
                                : "bg-purple-500"
                            }`}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Agenda for {selectedDateStr}</h4>
                <div className="space-y-2">
                  {allItems.filter(item => item.date === selectedDateStr).length > 0 ? (
                    allItems.filter(item => item.date === selectedDateStr).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl border border-border/80 bg-accent/20 px-4 py-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${
                              item.type === "holiday" 
                                ? "bg-rose-500" 
                                : item.type === "event" 
                                ? "bg-blue-500" 
                                : "bg-purple-500"
                            }`} />
                            <span className="font-semibold text-sm">{item.name}</span>
                          </div>
                          <p className="text-muted-foreground pl-4">{item.info}</p>
                        </div>
                        {item.link && (
                          <Button size="sm" variant="outline" onClick={() => window.open(item.link, "_blank")}>Join Meeting</Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                      No corporate events or meetings scheduled for this day.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "holidays" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Upcoming Company Holidays</h3>
              <div className="space-y-3">
                {UPCOMING_HOLIDAYS.map((h, i) => (
                  <div key={i} className="border bg-card/30 rounded-xl p-4 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-sm">{h.name}</div>
                      <div className="text-muted-foreground mt-0.5">{h.day}</div>
                    </div>
                    <Badge variant="outline">{h.date}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Corporate Events</h3>
              <div className="space-y-3">
                {[
                  { name: "Q3 Corporate Town Hall Meeting", date: "2026-07-20", time: "4:00 PM - 5:30 PM", desc: "Global updates from the leadership team." },
                  { name: "Design System Migration Sync", date: "2026-07-22", time: "2:00 PM - 3:00 PM", desc: "Alignment check for design tokens updates." }
                ].map((item, i) => (
                  <div key={i} className="border border-border bg-card/30 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-sm">{item.name}</div>
                      <span className="text-muted-foreground text-[10px]">{item.date} | {item.time}</span>
                    </div>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "meetings" && (
            <div className="grid gap-6 md:grid-cols-2">
              <form onSubmit={handleScheduleMeeting} className="space-y-4 text-xs">
                <h3 className="text-base font-semibold border-b pb-2">Schedule Meeting</h3>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Meeting Title</Label>
                  <Input
                    required
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="e.g. Design Sync / Client Demo"
                    className="bg-background/50 border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Meeting Date</Label>
                  <Input
                    type="date"
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="bg-background/50 border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Time slot</Label>
                  <Input
                    required
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    placeholder="e.g. 2:00 PM - 2:30 PM"
                    className="bg-background/50 border"
                  />
                </div>

                <Button type="submit">Schedule Meeting</Button>
              </form>

              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-2">My Meetings</h3>
                <div className="space-y-3">
                  {meetings.map((m, i) => (
                    <div key={i} className="border bg-card/30 rounded-xl p-4 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-sm">{m.title}</div>
                        <div className="text-muted-foreground mt-0.5">{m.date} | {m.time}</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                        window.open(m.link, "_blank");
                        toast.info("Joining scheduled virtual meeting...");
                      }}>
                        <VideoIcon className="h-4 w-4 mr-1.5 text-indigo-400" /> Join
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
