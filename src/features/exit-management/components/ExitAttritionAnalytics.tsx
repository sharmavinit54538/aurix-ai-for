import { LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { COLORS } from "../constants";
import type { AttritionChartPoint, MonthlyTrendPoint } from "../types";

interface ExitAttritionAnalyticsProps {
  attritionChartData: AttritionChartPoint[];
  monthlyExitTrends: MonthlyTrendPoint[];
}

export function ExitAttritionAnalytics({
  attritionChartData,
  monthlyExitTrends,
}: ExitAttritionAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Chart 1: Attrition by Department */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Department-wise Exits</CardTitle>
          <CardDescription className="text-xs">
            Count of offboardings logged per department
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attritionChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="department" style={{ fontSize: 9 }} />
              <YAxis style={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Exit Count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chart 2: Monthly Exit Trends */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Monthly Exit Trends</CardTitle>
          <CardDescription className="text-xs">
            Timeline attrition count from real exit records
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          {monthlyExitTrends.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground p-6">
              <LogOut className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
              <p>No historical exit trends to display</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={monthlyExitTrends}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {monthlyExitTrends.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
