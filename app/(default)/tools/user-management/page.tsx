import { redirect } from "next/navigation";

export default async function Page() {
    redirect('/tools/user-management/participant-users');

    return (
        <></>
    )
}
