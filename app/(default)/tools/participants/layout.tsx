import { Toaster } from "sonner";
import ParticipantsSidebar from "./_components/participants-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/auth";


export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    return (
        <SidebarProvider
            className="max-w-full overflow-hidden"
        >
            <ParticipantsSidebar
                user={session?.user}
                expires={session?.tokenExpiresAt}
            />
            <div className="flex grow min-w-0 flex-col h-screen bg-center bg-cover bg-[url(/images/paper_iceberg2.png)]">
                {children}
                <Toaster />
            </div>
        </SidebarProvider>
    )
}
