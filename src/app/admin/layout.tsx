"use client";

import React from 'react';
import AppLayout from '@/components/layout/app-layout';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-muted/40">
            <SidebarNav isAdmin={true} />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
