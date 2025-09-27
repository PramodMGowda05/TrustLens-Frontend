"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { mockModerationQueue } from "@/lib/mock-data";

export function ModerationTable() {
  const getCredibilityColor = (score: number) => {
    if (score > 75) return "bg-green-500";
    if (score > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Moderation Queue</CardTitle>
        <CardDescription>Reviews flagged for manual review.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reviewer</TableHead>
              <TableHead className="hidden md:table-cell">Credibility</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="hidden sm:table-cell">Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockModerationQueue.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.reviewer}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Progress value={item.credibility} className="h-2 w-20" indicatorClassName={getCredibilityColor(item.credibility)} />
                    <span>{item.credibility}%</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">{item.review}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline">{item.flaggedReason}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
