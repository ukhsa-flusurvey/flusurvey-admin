import DocSidebar from "./_components/doc-sidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex h-screen max-h-screen overflow-hidden p-1 pl-0 bg-secondary">
            <DocSidebar />
            <main className="h-full grow max-h-full rounded-xl overflow-hidden drop-shadow-md shadow-md">
                <div className="h-full  overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
