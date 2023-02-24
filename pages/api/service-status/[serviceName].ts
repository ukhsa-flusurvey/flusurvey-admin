import caseAdminAPIInstance from '@/utils/server/api';
import { isAxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'



export type ServiceStatusInfo = {
    msg: string;
    status: number;
}



const fetchStatus = async (serviceName: string) => {
    try {
        const response = await caseAdminAPIInstance.get<ServiceStatusInfo>(`/v1/status/${serviceName}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ServiceStatusInfo>
) {
    const { serviceName } = req.query as { serviceName: string };
    try {
        const status = await fetchStatus(serviceName);
        res.status(200).json(status);
    } catch (error) {
        if (isAxiosError(error)) {
            // handle axios error
            console.log(error.response)
            res.status(200).json({ msg: 'Service is not available', status: 503 });
        } else {
            // handle other errors
            console.log(error)
            res.status(500).json({ msg: 'Internal Server Error', status: 500 });
        }

    }
}
