"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, BarChart3, Shield, UserCog, Package } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import React from 'react';

type NavItem = {
    href: string;
    label: string;
    icon: React.ElementType;
    adminOnly?: boolean;
};

const navItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin", label: "Admin", icon: Shield, adminOnly: true },
];

export function SidebarNav({ isAdmin = false }: { isAdmin?: boolean }) {
    const pathname = usePathname();

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold font-headline text-primary">
                    <div className="rounded-lg bg-primary p-2 text-primary-foreground">
                        <Bot className="h-6 w-6" />
                    </div>
                    <span className="group-data-[collapsible=icon]:hidden">TrustView</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        (!item.adminOnly || isAdmin) && (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.href}
                                    tooltip={{
                                        children: item.label,
                                        className: "bg-primary text-primary-foreground",
                                    }}
                                    className={cn(
                                        "justify-start",
                                        pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/20"
                                    )}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="h-5 w-5" />
                                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
