import ParticipantsAppbarBase from "./_components/ParticipantsAppbarBase";
import { Toaster } from "sonner";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen bg-center bg-cover bg-[url(/images/paper_iceberg2.png)]">
            <div className="shrink-0 bg-white">
                <ParticipantsAppbarBase />
            </div>
            <div className="grow overflow-hidden flex flex-col">
                {children}
            </div>
            <Toaster />
        </div>
    )
}
