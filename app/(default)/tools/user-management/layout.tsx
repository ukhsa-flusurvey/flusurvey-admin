import { Toaster } from "sonner";
import UserManagementAppbarBase from "./UserManagementAppbarBase";

export const metadata = {
    title: 'User Management',
    description: 'Manage users and service accounts and their permissions.',
}

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-screen">
            <UserManagementAppbarBase />
            <div className="bg-cover bg-center bg-[url(/images/tree-on-hill.png)] grow w-full p-6">
                {children}
            </div>
            <Toaster />
        </div>
    )
}
