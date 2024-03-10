'use client';

import { deleteStudyRuleVersion } from '@/actions/study/studyRules';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getStudyRulesVersion } from '@/lib/data/studyAPI';
import { Download, MoreVertical, PenSquare, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

interface StudyRuleVersionMenuProps {
    studyKey: string;
    versionId: string;
}

const StudyRuleVersionMenu: React.FC<StudyRuleVersionMenuProps> = (props) => {
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const onOpenInEditor = () => {
        router.push(`/tools/study-configurator/${props.studyKey}/rules/${props.versionId}`);
    }

    const onDownload = () => {
        startTransition(async () => {
            try {
                const resp = await getStudyRulesVersion(props.studyKey, props.versionId);
                const rules = resp.studyRules?.rules;
                if (!rules || resp.error) {
                    toast.error('Error downloading study rules', {
                        description: resp.error
                    });
                    return;
                }

                const data = JSON.stringify(rules, null, 2);
                const element = document.createElement("a");
                const file = new Blob([data], { type: 'application/json' });
                element.href = URL.createObjectURL(file);
                element.download = `${props.studyKey}_${resp.studyRules?.id}.json`;
                document.body.appendChild(element);
                element.click();
                toast.success('Study rules downloaded successfully');
            } catch (e: any) {
                console.error(e);
                toast.error('Error downloading study rules');
            }
        })
    }

    const onDelete = () => {
        if (!confirm('Are you sure you want to delete this rule version?')) {
            return;
        }

        startTransition(async () => {
            try {
                const resp = await deleteStudyRuleVersion(props.studyKey, props.versionId);
                if (resp.error) {
                    toast.error('Error deleting rules', {
                        description: resp.error
                    });
                    return;
                }
                toast.success('Rules deleted successfully');
            } catch (e: any) {
                console.error(e);
                toast.error('Error deleting rules');
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

export default StudyRuleVersionMenu;
