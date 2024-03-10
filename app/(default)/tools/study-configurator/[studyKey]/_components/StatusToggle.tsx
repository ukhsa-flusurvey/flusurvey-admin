'use client'

import { updateStudyStatus } from '@/actions/study/updateStudyProps';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';
import { BeatLoader } from 'react-spinners';
import { toast } from 'sonner';

interface StatusToggleProps {
    studyKey: string;
    status: string;
}

const statusValues = ['active', 'inactive'];

const StatusToggle: React.FC<StatusToggleProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();

    const onChangeStatus = (newStatus: string) => {
        startTransition(async () => {
            const resp = await updateStudyStatus(props.studyKey, newStatus);
            if (resp.error) {
                toast.error(resp.error);
                return;
            }
            toast.success('Status updated');

        });
    }

    return (
        <div className="flex items-center space-x-1 rounded-md bg-gray-100">
            <p className="px-6 shadow-none flex items-center">
                {!isPending && props.status}
                {isPending && <BeatLoader />}
            </p>
            <Separator orientation="vertical" className="h-[20px] bg-black/20" />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="px-2 shadow-none"
                        disabled={isPending}
                    >
                        <ChevronDownIcon className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    alignOffset={-5}
                    className="w-[200px]"
                    forceMount
                >
                    <DropdownMenuLabel>Change status to:</DropdownMenuLabel>

                    <DropdownMenuRadioGroup value={props.status} onValueChange={onChangeStatus}>
                        {statusValues.map((status) => (
                            <DropdownMenuRadioItem key={status} value={status}
                                disabled={props.status === status || isPending}
                            >
                                {status}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default StatusToggle;
