import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Trophy, Star, Medal, Award,
  Plus, Info, RefreshCw, CheckCircle2, Sparkles, Gift
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";

export const Route = createFileRoute("/dashboard/rewards")({
  head: () => ({ meta: [{ title: "Rewards — Aurix" }] }),
  component: RewardsPage,
});

function RewardsPage() {
  const ws = useAurix();
  const [activeTab, setActiveTab] = useState("rewards");
  const [points, setPoints] = useState(0);
  const [redeemedCount, setRedeemedCount] = useState(0);

  const [vouchers, setVouchers] = useState<any[]>([]);
  const [recognitions, setRecognitions] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  const handleRedeem = (cost: number, itemName: string) => {
    if (points < cost) {
      toast.error("Insufficient reward points balance.");
      return;
    }
    setPoints(points - cost);
    setRedeemedCount(prev => prev + 1);
    toast.success(`Redeemed coupon for: ${itemName}!`);
  };

  const employeeTabs = [
    { id: "rewards", label: "Rewards Portal", icon: Trophy },
    { id: "recognition", label: "Recognition", icon: Star },
    { id: "badges", label: "Badges Unlocked", icon: Medal },
    { id: "achievements", label: "Achievements", icon: Award },
  ];

  return (
    <>
      <PageHeader
        title="Rewards & Recognition"
        description="Redeem company reward points for vouchers, check peer appreciation, and track unlocked badges."
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
          {activeTab === "rewards" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="bg-background/40">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase font-semibold">Available Reward Points</CardDescription>
                    <CardTitle className="text-3xl font-bold mt-1 text-indigo-500">{points} PTS</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-background/40">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase font-semibold">Redeemed Vouchers</CardDescription>
                    <CardTitle className="text-2xl font-bold mt-1 text-emerald-500">{redeemedCount} Vouchers</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <h3 className="text-base font-semibold border-b pb-2 font-display">Redeemable Vouchers</h3>
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                {vouchers.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20 col-span-2">
                    No redeemable vouchers available in the portal currently.
                  </div>
                ) : (
                  vouchers.map((item, i) => (
                    <div key={i} className="border border-border bg-card/30 rounded-xl p-4 flex flex-col justify-between gap-3">
                      <div>
                        <div className="font-semibold text-sm">{item.name}</div>
                        <p className="text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2 border-t pt-2">
                        <span className="font-bold text-indigo-400">{item.points} Points</span>
                        <Button size="sm" onClick={() => handleRedeem(item.points, item.name)}>Redeem</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "recognition" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Peer Recognitions & Awards</h3>
              {recognitions.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No peer recognitions or appreciation notes received yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {recognitions.map((item, i) => (
                    <div key={i} className="border border-border bg-card/30 rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <div className="font-semibold text-sm">{item.title}</div>
                        <span className="text-muted-foreground text-[10px]">{item.date}</span>
                      </div>
                      <p className="text-muted-foreground italic">"{item.msg}"</p>
                      <div className="text-[10px] text-muted-foreground text-right">— From: {item.sender}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "badges" && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold border-b pb-2">My Unlocked Badges</h3>
              {badges.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No badges unlocked yet. Keep up the good work to unlock achievements!
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  {badges.map((b, idx) => (
                    <div key={idx} className="border bg-card/30 rounded-xl p-4 flex items-center gap-3">
                      <div className="h-10 w-10 grid place-items-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Medal className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{b.name}</div>
                        <div className="text-muted-foreground mt-0.5">{b.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Achievement Records</h3>
              {achievements.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No achievement records found.
                </div>
              ) : (
                <Card className="border overflow-hidden">
                  <Table className="text-xs">
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="pl-6 py-4">Award Title</TableHead>
                        <TableHead className="py-4">Issued By</TableHead>
                        <TableHead className="pr-6 py-4 text-right">Award Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {achievements.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="pl-6 py-4 font-semibold">{item.title}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{item.issuer}</TableCell>
                          <TableCell className="pr-6 py-4 text-right font-mono">{item.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
