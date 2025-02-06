import { SidebarProvider } from "@/components/ui/sidebar";
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

                <div className="h-full grow max-h-full rounded-xl overflow-hidden drop-shadow-md border border-border shadow-md bg-white">
                    <div className="h-full overflow-auto">
                        {children}
                    </div>
                </div>

            </div>

        </ SidebarProvider >

    );
}
