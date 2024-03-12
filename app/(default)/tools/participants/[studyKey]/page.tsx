import { redirect } from "next/navigation";


export default function Page({
    params,
}: {
    params: {
        studyKey: string;
    };
}) {
    redirect(`/tools/participants/${params.studyKey}/participants`);
}
