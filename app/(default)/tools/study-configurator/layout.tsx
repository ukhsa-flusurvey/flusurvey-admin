import StudyConfigAppbarBase from "./StudyConfigAppbarBase";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            <StudyConfigAppbarBase />
            {children}
        </div>
    )
}
