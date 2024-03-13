'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { Pagination } from "@/utils/server/types/paginationInfo";

export interface FileInfo {
    id: string;
    fileType: string;
    status: string;
    participantID: string;
    submittedAt: number;
    size: number;
}


export const getFileInfos = async (
    studyKey: string,
    page: number,
    filter?: string,
    pageSize?: number,
): Promise<{
    error?: string,
    fileInfos?: Array<FileInfo>
    pagination?: Pagination
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const queryParams = new URLSearchParams();

    if (filter) {
        queryParams.append('filter', filter);
    }
    queryParams.append('page', page.toString());
    if (pageSize) queryParams.append('limit', pageSize.toString());


    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-explorer/files?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch file infos: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}
