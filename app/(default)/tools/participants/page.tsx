import ParticipantsAppbarBase from "./ParticipantsAppbarBase";


export const dynamic = 'force-dynamic';

export default async function Page() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    return (
        <>
            <ParticipantsAppbarBase />

        </>
    )
}
