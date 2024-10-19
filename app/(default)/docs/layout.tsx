import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DocSidebar from "./_components/doc-sidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (


        <SidebarProvider>
            <div className="flex h-screen w-full max-h-screen overflow-hidden p-1 bg-sidebar">
                <DocSidebar />

                <main className="h-full grow max-h-full rounded-xl overflow-hidden drop-shadow-md shadow-md bg-white p-4">
                    <div className="h-full overflow-auto">
                        {children}
                    </div>
                </main>

            </div>

        </ SidebarProvider >

    );
}
