import DocSidebar from "./_components/doc-sidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    const incrementsLong = Array.from({ length: 100 }).map((_, i) => i);

    return (
        <div className="flex h-screen max-h-screen overflow-hidden p-1 bg-secondary">
            <DocSidebar />
            <main className="h-full grow max-h-full rounded-xl overflow-hidden">
                <div className="bg-red-400 h-full  overflow-scroll space-y-2 p-4">
                    {children}
                    {incrementsLong.map((i) => (
                        <div key={i} className="w-full bg-slate-500" >
                            {i}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
