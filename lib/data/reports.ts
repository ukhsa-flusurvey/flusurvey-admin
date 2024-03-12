'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { Pagination } from "@/utils/server/types/paginationInfo";

export const getReports = async (
    studyKey: string,
    page: number,
    reportKey?: string,
    filter?: string,
    pageSize?: number,
): Promise<{
    error?: string,
    reports?: Array<{

    }>
    pagination?: Pagination
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const queryParams = new URLSearchParams();
    if (reportKey) {
        queryParams.append('reportKey', reportKey);
    }
    if (filter) {
        queryParams.append('filter', filter);
    }
    queryParams.append('page', page.toString());
    if (pageSize) queryParams.append('limit', pageSize.toString());


    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-explorer/reports?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch reports: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}
