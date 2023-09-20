import NotImplemented from "@/components/NotImplemented";
import UserManagementAppbarBase from "./UserManagementAppbarBase";
import { Card, CardBody } from "@nextui-org/card";

export const dynamic = 'force-dynamic';

export default async function Page() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    return (
        <div className="flex flex-col h-screen">
            <UserManagementAppbarBase />
            <main className="bg-cover bg-center bg-[url(/images/abstract_gi.png)] grow w-full">
                <div className="backdrop-blur-md bg-white/50 h-full w-full flex items-center justify-center">
                    <Card
                        className="bg-white/80"
                        isBlurred={true}
                    >
                        <CardBody>
                            <NotImplemented
                            >
                                Methods for user management are not implemented yet
                            </NotImplemented>
                        </CardBody>
                    </Card>
                </div>
            </main>

        </div>
    )
}
