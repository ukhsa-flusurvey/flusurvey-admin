import { format } from "date-fns";

export const dateFromTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000);
}

export const formatTimestamp = (timestamp: number) => {
    return format(dateFromTimestamp(timestamp), 'yyyy-MM-dd HH:mm');
}
