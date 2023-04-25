import 'server-only';
import { getCASEManagementAPIURL } from "./api";

export type ServiceStatusInfo = {
    msg: string;
    status: number;
}

export const getServiceStatus = async (serviceName: string): Promise<ServiceStatusInfo> => {
    const url = getCASEManagementAPIURL(`/v1/status/${serviceName}`);

    const response = await fetch(url,
        {
            next: {
                revalidate: 10
            }
        });
    if (response.status !== 200) {
        try {
            const err = await response.json();
            throw new Error(err.error);
        } catch (error) {
            throw new Error(`Error ${response.status} when getting status of ${serviceName}`);
        }
    }
    const data = await response.json();
    return data as ServiceStatusInfo;
};
