'use client'

import { deleteSurveyVersion } from '@/actions/study/surveys';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getSurveyVersion } from '@/lib/data/studyAPI';
import { Download, MoreVertical, PenSquare, Trash2 } from 'lucide-react';
import React, { useTransition } from 'react';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface SurveyVersionMenuProps {
    studyKey: string;
    surveyKey: string;
    versionId: string;
}

const SurveyVersionMenu: React.FC<SurveyVersionMenuProps> = (props) => {
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const onOpenInEditor = () => {
        router.push(`/tools/editors/survey-from-server?studyKey=${props.studyKey}&surveyKey=${props.surveyKey}&versionId=${props.versionId}`);
    }

    const onDownload = () => {
        startTransition(async () => {
            try {
                const resp = await getSurveyVersion(props.studyKey, props.surveyKey, props.versionId);
                const survey = resp.survey;
                if (!survey || resp.error) {
                    toast.error('Error downloading survey', {
                        description: resp.error
                    });
                    return;
                }

                const data = JSON.stringify(survey, null, 2);
                const element = document.createElement("a");
                const file = new Blob([data], { type: 'application/json' });
                element.href = URL.createObjectURL(file);
                element.download = `${props.surveyKey}_${survey.versionId}.json`;
                document.body.appendChild(element);
                element.click();
                toast.success('Survey downloaded successfully');
            } catch (e: unknown) {
                console.error(e);
                toast.error('Error downloading survey', { description: (e as Error).message });
            }
        })
    }

    const onDelete = () => {
        if (!confirm('Are you sure you want to delete this survey?')) {
            return;
        }

        startTransition(async () => {
            try {
                const resp = await deleteSurveyVersion(props.studyKey, props.surveyKey, props.versionId);
                if (resp.error) {
                    toast.error('Error deleting survey', {
                        description: resp.error
                    });
                    return;
                }
                toast.success('Survey deleted successfully');
            } catch (e: unknown) {
                console.error(e);
                toast.error('Error deleting survey', { description: (e as Error).message });
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={'ghost'}
                    size={'icon'}
                >
                    <MoreVertical className='size-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <BarLoader loading={isPending}
                    width={'100%'}
                />
                <DropdownMenuItem
                    disabled={isPending}
                    onClick={onDownload}
                >
                    <Download className='me-2 size-4 text-neutral-500' />
                    Download JSON
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={isPending}
                    onClick={onOpenInEditor}
                >
                    <PenSquare className='me-2 size-4 text-neutral-500' />
                    Open in editor
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={isPending}
                    className='text-red-600'
                    onClick={onDelete}
                >
                    <Trash2 className='me-2 size-4 text-red-500' />
                    Delete version
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SurveyVersionMenu;
