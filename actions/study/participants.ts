'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { ParticipantState } from "@/utils/server/types/participantState";
import { revalidatePath } from "next/cache";


export const updateParticipant = async (
    studyKey: string,
    participant: ParticipantState,
) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const participantID = participant.participantId;

    const url = `/v1/studies/${studyKey}/data-explorer/participants/${participantID}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'PUT',
            body: JSON.stringify(participant),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to update participant: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/participants');
    return resp.body;
}
