import { FileIcon, Layers2Icon, SquareArrowRightIcon, TableIcon, UsersRoundIcon } from "lucide-react";

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

export const FilesPageLinkContent = () => {
    return (
        <div className="flex items-center gap-2">
            <FileIcon className='size-4' />
            Files
        </div>
    );
}

export const ActionsPageLinkContent = () => {
    return (
        <div className="flex items-center gap-2">
            <SquareArrowRightIcon className='size-4' />
            Actions
        </div>
    );
}
