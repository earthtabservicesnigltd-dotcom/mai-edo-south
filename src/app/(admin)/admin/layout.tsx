'use client'

import { AppSidebar } from "@/components/layout/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"



export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();
return (
   <SidebarProvider defaultOpen={!isMobile}>
     {/* ── SIDEBAR ── */}
    <AppSidebar/>
    <SidebarInset />
    
      {/* ── MAIN CONTENT ── */}
      <main className="p-8 min-h-screen bg-gray-50 w-full overflow-hidden">
        {children}
      </main>
   </SidebarProvider>
)
  
}