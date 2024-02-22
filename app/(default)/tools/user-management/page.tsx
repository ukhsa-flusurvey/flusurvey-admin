import NotImplemented from "@/components/NotImplemented";
import { Card } from "@/components/ui/card";


export const dynamic = 'force-dynamic';

export default async function Page() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    return (
        <main className="h-full flex items-center w-full justify-center">
            <Card
                className="p-6 h-16 w-80"
                variant={"opaque"}
            >



            </Card>

        </main >
    )
}
