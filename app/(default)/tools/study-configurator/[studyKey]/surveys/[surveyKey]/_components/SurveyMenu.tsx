'use client'

import { unpublishSurvey } from '@/actions/study/surveys';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Ban, MoreVertical } from 'lucide-react';
import React, { useTransition } from 'react';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

interface SurveyMenuProps {
    studyKey: string;
    surveyKey: string;
}

const SurveyMenu: React.FC<SurveyMenuProps> = (props) => {
    const [isPending, startTransition] = useTransition();

    const onUnpublish = () => {
        startTransition(async () => {
            if (!confirm('Are you sure you want to unpublish this survey?')) {
                return;
            }

            try {
                const resp = await unpublishSurvey(props.studyKey, props.surveyKey);
                if (resp.error) {
                    toast.error('Failed to unpublish survey.', {
                        description: resp.error
                    });
                    return;
                }
                toast.success('Survey unpublished successfully.');
            } catch (e: unknown) {
                console.error(e);
                toast.error('Failed to unpublish survey.', { description: (e as Error).message });
            }
        })
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
            >
                <Button
                    variant={'ghost'}
                    size={'icon'}
                >
                    <MoreVertical className='size-5' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
            >
                <BarLoader
                    loading={isPending}
                    color='#155e75'
                    width={'100%'}
                />
                <DropdownMenuItem
                    className='flex gap-3 text-red-600'
                    onClick={onUnpublish}
                >
                    <div>
                        <Ban
                            className='size-4 opacity-70'
                        />
                    </div>
                    <div>
                        <div className='font-bold'>
                            Unpublish
                        </div>
                        <div className='text-xs'>
                            to make it unavailable for participants
                        </div>
                    </div>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SurveyMenu;
