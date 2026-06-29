import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{
        studyKey: string
    }>
}

export const dynamic = 'force-dynamic';

const Page = async (props: PageProps) => {
    const { studyKey } = await props.params;
    redirect(`/tools/participants/${studyKey}/actions/general`);
    return null;
};

export default Page;
