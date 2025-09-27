import { Button } from "@/components/ui/button";
import { ModerationTable } from "@/components/admin/moderation-table";
import { Bot } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Moderate reviews and manage the AI model.</p>
                </div>
                <Button>
                    <Bot className="mr-2 h-4 w-4" />
                    Retrain Model
                </Button>
            </div>
            <ModerationTable />
        </div>
    );
}
