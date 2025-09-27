"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CircularProgress } from "./circular-progress"
import type { HistoryItem } from "@/lib/types"

type ResultDisplayProps = {
  result: HistoryItem;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const { trustScore, predictedLabel, explanation, productOrService, platform } = result;
  
  const score = trustScore * 100;
  const labelVariant = predictedLabel === 'genuine' ? 'default' : 'destructive';
  const badgeClass = predictedLabel === 'genuine' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30'

  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Analysis Result</CardTitle>
        <CardDescription>
          For "{productOrService}" on {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center justify-center text-center">
             <CircularProgress value={score} />
             <p className="mt-2 text-sm font-semibold text-muted-foreground">Trust Score</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Predicted Label</h3>
                <Badge variant={labelVariant} className={`w-fit text-base ${badgeClass}`}>
                    {predictedLabel.charAt(0).toUpperCase() + predictedLabel.slice(1)}
                </Badge>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="explanation">
                <AccordionTrigger className="text-sm font-medium">View Explanation</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {explanation}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
