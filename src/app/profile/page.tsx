import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, LifeBuoy } from "lucide-react";
import { MyAccountTab } from "@/components/profile/my-account-tab";
import { SettingsTab } from "@/components/profile/settings-tab";
import { SupportTab } from "@/components/profile/support-tab";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="account">
                        <User className="mr-2" />
                        My Account
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                        <Settings className="mr-2" />
                        Settings
                    </TabsTrigger>
                    <TabsTrigger value="support">
                        <LifeBuoy className="mr-2" />
                        Support
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <MyAccountTab />
                </TabsContent>
                <TabsContent value="settings">
                    <SettingsTab />
                </TabsContent>
                <TabsContent value="support">
                    <SupportTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
