import ParticipantsAppbarBase from "./ParticipantsAppbarBase";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            <ParticipantsAppbarBase />
            <div className="bg-cover bg-center bg-[url(/images/paper_iceberg2.png)] grow">
                {children}
            </div>
        </div>
    )
}
