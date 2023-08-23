import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";


export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: {
        messageType?: string;
        studyKey?: string;
    }
}


export default async function Page(props: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/auth/login?callbackUrl=/tools/messaging/custom-messages');
    }

    // get all custom messages
    // filter for current message type and studyKey
    // if failed with unauth - go to login

    return (
        <div className="px-unit-lg h-full">
            <div className="py-unit-sm">
                <Breadcrumbs
                    homeLink="/tools/messaging"
                    links={
                        [
                            {
                                title: 'Custom messages',
                            },
                        ]
                    }
                />
                <main className="py-unit-lg">
                    open editor with current message
                </main>
            </div>
        </div>
    )
}
