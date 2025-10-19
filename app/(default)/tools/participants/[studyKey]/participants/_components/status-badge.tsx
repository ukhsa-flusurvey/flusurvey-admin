import { participantStudyStatus } from "./utils";

import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status: string }) => {
    const statusLabel = participantStudyStatus[status as keyof typeof participantStudyStatus]?.label || status;
    const statusBgColor = participantStudyStatus[status as keyof typeof participantStudyStatus]?.bgColor || participantStudyStatus.other.bgColor;
    const statusBorderColor = participantStudyStatus[status as keyof typeof participantStudyStatus]?.borderColor || participantStudyStatus.other.borderColor;
    return (
        <div className={cn('px-2 py-0.5 rounded-full text-xs border w-fit flex items-center gap-1 bg-white', statusBorderColor)}>
            <span className={cn('size-2 rounded-full inline-block bg-white', statusBgColor)}></span>
            <span className='text-[10px] font-semibold uppercase'>{statusLabel}</span>
        </div>
    )
}

export default StatusBadge;
