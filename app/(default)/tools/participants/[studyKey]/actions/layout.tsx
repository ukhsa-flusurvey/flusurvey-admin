import { Card } from "@/components/ui/card";
import ActionsSidebar from "./_components/actions-sidebar";

export default function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        studyKey: string;
    };
}) {

    return (
        <Card
            className="my-6 flex "
            variant={"opaque"}
        >
            <ActionsSidebar
                studyKey={params.studyKey}
            />
            {children}
        </Card>
    );
}
