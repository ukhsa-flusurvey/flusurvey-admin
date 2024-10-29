import { Layers2Icon, TableIcon, UsersRoundIcon } from "lucide-react";

export const ParticipantsPageLinkContent = () => {
    return (
        <div className="flex items-center gap-2">
            <UsersRoundIcon className='size-4' />
            Participants
        </div>
    );
}

export const ResponsesPageLinkContent = () => {
    return (
        <div className="flex items-center gap-2">
            <TableIcon className='size-4' />
            Responses
        </div>
    );
}

export const ReportsPageLinkContent = () => {
    return (
        <div className="flex items-center gap-2">
            <Layers2Icon className='size-4' />
            Reports
        </div>
    );
}
