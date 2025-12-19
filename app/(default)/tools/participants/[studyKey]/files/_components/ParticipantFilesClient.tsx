'use client';

import { deleteParticipantFile } from '@/actions/study/files';
import AvatarFromId from '@/components/AvatarFromID';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileInfo, getFileInfos } from '@/lib/data/fileInfos';
import { Calendar, Download, Save, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { BsFileEarmark, BsFiletypeCsv, BsFiletypeJpg, BsFiletypeJson, BsFiletypePdf, BsFiletypePng } from 'react-icons/bs';
import { toast } from 'sonner';

interface ParticipantFilesClientProps {
    studyKey: string;
    filter?: string;
    fileInfos: Array<FileInfo>;
    totalCount: number;
    pageSize: number;
}


const ParticipantFilesClient: React.FC<ParticipantFilesClientProps> = (props) => {
    const [isMounted, setIsMounted] = React.useState(false);

    const [fileInfos, setFileInfos] = React.useState(props.fileInfos || []);
    const [totalCount, setTotalCount] = React.useState(props.totalCount || 0);
    const [isPending, startTransition] = React.useTransition();

    const pageSize = props.pageSize || 20;

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        }
    }, []);

    if (!isMounted) {
        return null;
    }

    const onLoadMore = () => {
        const page = Math.floor(fileInfos.length / pageSize) + 1;
        startTransition(async () => {
            try {
                const resp = await getFileInfos(
                    props.studyKey,
                    page,
                    props.filter,
                    pageSize,
                );
                if (resp.error) {
                    toast.error('Failed to load more file infos', {
                        description: resp.error
                    });
                    return;
                }
                if (resp.fileInfos) {
                    setFileInfos([...fileInfos, ...resp.fileInfos]);
                }
                if (resp.pagination) {
                    setTotalCount(resp.pagination.totalCount);
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to load more file infos');
            }
        });
    }

    const hasMore = totalCount > fileInfos.length;

    if (fileInfos.length === 0) {
        return (
            <div>no reports</div>
        )
    }

    const onDownloadFile = (fileInfo: FileInfo) => {
        startTransition(async () => {
            const url = `/api/case-management-api/v1/studies/${props.studyKey}/data-explorer/files/${fileInfo.id}`;

            try {
                const resp = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    next: {
                        revalidate: 5
                    }
                });
                if (resp.status !== 200) {
                    const err = await resp.json();
                    toast.error('Failed to download file', {
                        description: err.error,
                    });
                    return;
                }
                const blob = await resp.blob();
                const fileName = resp.headers.get('Content-Disposition')?.split('filename=')[1];
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = (fileName || 'participant_file').replaceAll('"', '');
                link.click();

                toast.success('File downloaded');
            } catch (e) {
                console.error(e);
                toast.error('Failed to download file');
            }
        });
    }

    const onDeleteFile = (fileInfo: FileInfo) => {
        if (!confirm('Are you sure you want to delete this file?')) {
            return;
        }

        startTransition(async () => {
            try {
                const resp = await deleteParticipantFile(
                    props.studyKey,
                    fileInfo.id,
                );
                if (resp.error) {
                    toast.error('Failed to delete file', {
                        description: resp.error
                    });
                    return;
                }
                toast.success('File deleted');

                setFileInfos(fileInfos.filter(f => f.id !== fileInfo.id));

            } catch (e) {
                console.error(e);
                toast.error('Failed to delete file');
            }
        })
    }

    const getFileIcon = (fileType: string) => {
        let icon = <span><BsFileEarmark /></span>;
        if (fileType.includes('csv')) {
            icon = <span><BsFiletypeCsv /></span>;
        } else if (fileType.includes('json')) {
            icon = <span><BsFiletypeJson /></span>;
        } else if (fileType.includes('pdf')) {
            icon = <span><BsFiletypePdf /></span>;
        } else if (fileType.includes('png')) {
            icon = <span><BsFiletypePng /></span>
        } else if (fileType.includes('jpeg') || fileType.includes('jpg')) {
            icon = <span><BsFiletypeJpg /></span>
        }
        return <span
            className='text-2xl text-neutral-500'
        >{icon}</span>;
    }
    return (
        <div className='h-full w-full'>
            <div className='overflow-y-scroll h-full pb-6'>
                <ul className='p-4 space-y-4'>
                    {fileInfos.map((fileInfo) => {
                        return (<li key={fileInfo.id}
                            className='p-4 bg-white rounded-md border border-neutral-300 flex gap-4 items-center'
                        >
                            <div className='flex justify-center flex-col items-center gap-1'>
                                {getFileIcon(fileInfo.fileType)}

                                <p className='text-sm'>
                                    {(fileInfo.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <div className='grow space-y-1'>
                                <div className='flex gap-2 items-center text-neutral-600 text-xs'>
                                    <span>
                                        <Calendar className='size-4' />
                                    </span>
                                    <span>
                                        {fileInfo.createdAt ? new Date(fileInfo.createdAt).toLocaleString() : 'N/A'}
                                    </span>
                                    {fileInfo.status !== 'ready' && <Badge>{fileInfo.status}</Badge>}
                                </div>

                                <div className='flex items-center justify-start w-full overflow-hidden text-ellipsis gap-2'>
                                    <div className='p-1 flex items-center'>
                                        <AvatarFromId userId={fileInfo.participantID}
                                            pixelSize={2}
                                        />
                                    </div>
                                    <span className='flex items-center font-mono text-sm'>{
                                        fileInfo.participantID
                                    }</span>
                                </div>

                            </div>
                            <div className='space-x-2'>
                                <Button
                                    size='icon'
                                    variant={'ghost'}
                                    disabled={isPending}
                                    onClick={() => onDownloadFile(fileInfo)}
                                >
                                    <Save className='size-4' />
                                </Button>

                                <Button
                                    size='icon'
                                    variant={'ghost'}
                                    disabled={isPending}
                                    onClick={() => onDeleteFile(fileInfo)}
                                >
                                    <Trash2 className='size-4' />
                                </Button>
                            </div>
                        </li>)
                    })}
                </ul>


                <div className='h-6 w-full bg-slate-50 absolute bottom-0 left-0 border-t border-neutral-300'>
                    <div className='flex items-center justify-between px-4 h-full'>
                        <p className='text-neutral-500 text-xs '>
                            Showing files:
                            <span className='ms-2'>
                                {fileInfos.length} of {totalCount}
                            </span>
                        </p>

                        {hasMore && <Button
                            variant={'link'}
                            className='text-xs px-0 h-4'
                            onClick={onLoadMore}
                            disabled={isPending}
                        >
                            <Download className='size-3 me-2' />
                            {isPending ? 'Loading...' : 'Load more'}
                        </Button>}

                        <div className='w-20'>

                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantFilesClient;
