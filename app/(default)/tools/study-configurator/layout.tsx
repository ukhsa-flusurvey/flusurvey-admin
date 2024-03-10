import { Toaster } from "sonner";
import StudyConfigAppbarBase from "./_components/StudyConfigAppbarBase";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            <StudyConfigAppbarBase />
            <div className="bg-cover bg-center bg-[url(/images/paper_iceberg.png)] grow">
                {children}
            </div>
            <Toaster />
        </div>
    )
}
