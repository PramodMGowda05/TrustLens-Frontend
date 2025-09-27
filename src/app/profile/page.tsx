import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, LifeBuoy } from "lucide-react";
import { MyAccountTab } from "@/components/profile/my-account-tab";

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
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                            <CardDescription>Application settings and preferences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Settings content goes here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="support">
                    <Card>
                        <CardHeader>
                            <CardTitle>Support</CardTitle>
                            <CardDescription>Get help and support.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Support content goes here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
