import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";


export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        studyKey: string;
    }
}

export default async function Page(props: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect(`/auth/login?callbackUrl=/tools/participants`);
    }

    return (
        <main className="px-unit-lg">
            todo
        </main>
    );
}
