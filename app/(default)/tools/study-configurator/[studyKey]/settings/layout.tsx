import SettingsNav from "./_components/SettingsNav";

export default function Layout({
    children,
    params: {
        studyKey,
    },
}: {
    children: React.ReactNode;
    params: {
        studyKey: string;
    }
}) {

    return (
        <div className="flex gap-4">
            <SettingsNav
                studyKey={studyKey}
            />
            <>
                {children}
            </>
        </div>
    );
}
