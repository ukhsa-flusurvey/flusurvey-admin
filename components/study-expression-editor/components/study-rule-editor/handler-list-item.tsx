import { ExpressionArg } from '@/components/expression-editor/utils';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BracketsIcon, ChevronRight, FileMinus2Icon, FilePlus2Icon, FlagIcon, GlobeIcon, LinkIcon, MailIcon, NotebookTextIcon, ShieldIcon } from 'lucide-react';
import React from 'react';

interface HandlerListItemProps {
    index?: number;
    label?: string;
    actions?: ExpressionArg[];
    onSelect: () => void;
    onRemove: () => void;
}

const IconWithTooltip: React.FC<{ icon: React.ReactNode, tooltip: string, show: boolean }> = (props) => {
    if (!props.show) {
        return null;
    }
    return (
        <Tooltip>
            <TooltipTrigger className='px-1' asChild>
                <span>
                    {props.icon}
                </span>
            </TooltipTrigger>
            <TooltipContent align='center' side='top' sideOffset={-20}>
                {props.tooltip}
            </TooltipContent>
        </Tooltip>
    );
}

const checkIfActionsIncludeAny = (actions: undefined | ExpressionArg[], includes: string[]) => {
    if (actions === undefined || actions.length === 0) {
        return false;
    }
    const actionStr = JSON.stringify(actions);
    return includes.some(i => actionStr.includes(i));
}


const HandlerListItem: React.FC<HandlerListItemProps> = (props) => {
    const hasMessageActions = checkIfActionsIncludeAny(props.actions, [
        'ADD_MESSAGE',
        'REMOVE_ALL_MESSAGES',
        'REMOVE_MESSAGES_BY_TYPE',
        'NOTIFY_RESEARCHER'
    ]);

    const hasAssignSurveyAction = checkIfActionsIncludeAny(props.actions, [
        'ADD_NEW_SURVEY'
    ]);

    const hasRemoveSurveyAction = checkIfActionsIncludeAny(props.actions, [
        'REMOVE_ALL_SURVEYS',
        'REMOVE_SURVEYS_BY_KEY'
    ]);

    const hasReportAction = checkIfActionsIncludeAny(props.actions, [
        'INIT_REPORT',
        'CANCEL_REPORT',
        'UPDATE_REPORT_DATA',
        'REMOVE_REPORT_DATA'
    ]);

    const hasParticipantFlagsAction = checkIfActionsIncludeAny(props.actions, [
        'UPDATE_FLAG',
        'REMOVE_FLAG',
    ]);

    const hasHandlingOfConfidentialResponses = checkIfActionsIncludeAny(props.actions, [
        'REMOVE_CONFIDENTIAL_RESPONSE_BY_KEY',
        'REMOVE_ALL_CONFIDENTIAL_RESPONSES',
    ]);

    const hasLinkingCodes = checkIfActionsIncludeAny(props.actions, [
        'SET_LINKING_CODE',
        'DELETE_LINKING_CODE',
        'DRAW_STUDY_CODE_AS_LINKING_CODE',
        'REMOVE_STUDY_CODE'
    ]);

    const hasExternalHandlers = checkIfActionsIncludeAny(props.actions, [
        'EXTERNAL_EVENT_HANDLER',
    ]);

    const hasNoActions = props.actions === undefined || props.actions.length === 0 || (
        !hasMessageActions &&
        !hasAssignSurveyAction &&
        !hasRemoveSurveyAction &&
        !hasReportAction && !hasParticipantFlagsAction &&
        !hasHandlingOfConfidentialResponses &&
        !hasLinkingCodes &&
        !hasExternalHandlers
    );

    return (
        <TooltipProvider>
            <ContextMenu>
                <ContextMenuTrigger asChild>

                    <Button
                        className='w-full h-auto min-h-12 rounded-none focus-visible:ring-0 focus-visible:bg-secondary justify-between'
                        variant={'ghost'}
                        onClick={() => {
                            props.onSelect();
                        }}
                    >


                        <div className='flex items-center gap-2'>
                            {
                                props.index !== undefined && <>
                                    <span className='text-sm mx-1 text-muted-foreground'>
                                        {props.index + 1}
                                    </span>
                                    <Separator orientation='vertical' className='h-6' />
                                </>
                            }

                            <div>
                                <div className='font-mono text-xs font-bold text-start'>
                                    {props.label}
                                </div>
                                <div className='flex items-center mt-1 ps-2'>
                                    <IconWithTooltip
                                        icon={<BracketsIcon className='size-4 text-muted-foreground' />}
                                        tooltip='Empty handler'
                                        show={hasNoActions}
                                    />
                                    <IconWithTooltip
                                        icon={<MailIcon className='size-4 text-muted-foreground' />}
                                        tooltip='Logic for participant messages'
                                        show={hasMessageActions}
                                    />
                                    <IconWithTooltip
                                        icon={<FilePlus2Icon className='size-4 text-muted-foreground' />}
                                        tooltip='Add new survey'
                                        show={hasAssignSurveyAction}
                                    />
                                    <IconWithTooltip
                                        icon={<FileMinus2Icon className='size-4 text-muted-foreground' />}
                                        tooltip='Remove survey'
                                        show={hasRemoveSurveyAction}
                                    />
                                    <IconWithTooltip
                                        icon={<NotebookTextIcon className='size-4 text-muted-foreground' />}
                                        tooltip='Report handling'
                                        show={hasReportAction}
                                    />
                                    <IconWithTooltip
                                        icon={<FlagIcon className='size-4 text-muted-foreground' />}
                                        tooltip='Participant flags'
                                        show={hasParticipantFlagsAction}
                                    />
                                    <IconWithTooltip
                                        icon={<ShieldIcon className='size-4 text-muted-foreground' />}
                                        tooltip='Handling of confidential data'
                                        show={hasHandlingOfConfidentialResponses}
                                    />
                                    <IconWithTooltip
                                        icon={<LinkIcon className='size-4 text-muted-foreground' />}
                                        tooltip='Linking codes / study codes'
                                        show={hasLinkingCodes}
                                    />
                                    <IconWithTooltip
                                        icon={<GlobeIcon className='size-4 text-muted-foreground' />}
                                        tooltip='External handlers'
                                        show={hasExternalHandlers}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <ChevronRight className='size-4 text-muted-foreground' />
                        </div>
                    </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={props.onSelect}>
                        Open
                    </ContextMenuItem>
                    <ContextMenuItem onClick={props.onRemove}>
                        Remove
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </TooltipProvider >
    );
};

export default HandlerListItem;
