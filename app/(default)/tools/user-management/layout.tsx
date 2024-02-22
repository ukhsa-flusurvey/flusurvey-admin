import UserManagementAppbarBase from "./UserManagementAppbarBase";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    return (
        <div className="flex flex-col h-screen">
            <UserManagementAppbarBase />
            <div className="bg-cover bg-center bg-[url(/images/tree-on-hill.png)] grow w-full p-6">
                {children}
            </div>
        </div>
    )
}
