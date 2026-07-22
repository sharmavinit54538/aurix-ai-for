import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CHART_COLORS } from "../constants";
import type { Asset } from "@/lib/hrms/types";
import { getAssetRepairCost } from "../utils";

interface AssetReportsProps {
  assets: Asset[];
  categoryChartData: any[];
  repairCostChartData: any[];
}

export function AssetReports({ assets, categoryChartData, repairCostChartData }: AssetReportsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-border bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Category Allocation</CardTitle>
          <CardDescription className="text-xs">Count of assets by category classification</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                {categoryChartData.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Maintenance Repair Costs ($)</CardTitle>
          <CardDescription className="text-xs">Accumulated service and parts expenditure by category</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={repairCostChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="category" style={{ fontSize: 9 }} />
              <YAxis style={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Total Repair Cost ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/40 backdrop-blur-xl lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Asset Financial Summary</CardTitle>
          <CardDescription className="text-xs">Capital expenditures and maintenance records per asset item</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="text-xs border-collapse">
            <TableHeader className="bg-muted/10 border-b border-border">
              <TableRow>
                <TableHead className="px-4 py-2.5">Asset</TableHead>
                <TableHead className="px-4 py-2.5">Category</TableHead>
                <TableHead className="px-4 py-2.5">Owner</TableHead>
                <TableHead className="px-4 py-2.5">Purchase Date</TableHead>
                <TableHead className="px-4 py-2.5 text-right">Purchase Cost</TableHead>
                <TableHead className="px-4 py-2.5 text-right">Repair Cost</TableHead>
                <TableHead className="px-4 py-2.5 text-right">Total Lifetime Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((a) => {
                const repCost = getAssetRepairCost(a);
                const lifeCost = (a.purchaseCost || 0) + repCost;
                return (
                  <TableRow key={a.id} className="border-t border-border hover:bg-accent/15">
                    <TableCell className="px-4 py-2 font-medium">
                      {a.tag} &bull; {a.name}
                    </TableCell>
                    <TableCell className="px-4 py-2 capitalize text-muted-foreground">{a.category}</TableCell>
                    <TableCell className="px-4 py-2">{a.assignedTo || "Available"}</TableCell>
                    <TableCell className="px-4 py-2 text-muted-foreground">{a.purchaseDate}</TableCell>
                    <TableCell className="px-4 py-2 text-right">${a.purchaseCost || 0}</TableCell>
                    <TableCell className="px-4 py-2 text-right text-amber-500">${repCost}</TableCell>
                    <TableCell className="px-4 py-2 text-right font-semibold">${lifeCost}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
