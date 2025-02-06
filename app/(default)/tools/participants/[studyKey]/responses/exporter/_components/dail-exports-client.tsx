'use client';

import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState } from 'react';
import { toast } from 'sonner';

export interface DailyExport {
    id: number;
    filename: string;
    surveyKey: string;
    date: string;
}

interface DailExportsClientProps {
    studyKey: string;
    dailyExports: Array<DailyExport>;
}

const DailExportsClient: React.FC<DailExportsClientProps> = (props) => {
    const [selectedFiles, setSelectedFiles] = useState<number[]>([])
    const [isPending, startTransition] = React.useTransition();

    const handleSelectFile = (id: number) => {
        setSelectedFiles(prev =>
            prev.includes(id) ? prev.filter(fileId => fileId !== id) : [...prev, id]
        )
    }
    const handleSelectAll = () => {
        setSelectedFiles(
            selectedFiles.length === props.dailyExports.length
                ? []
                : props.dailyExports.map(file => file.id)
        )
    }

    const handleDownload = () => {
        startTransition(async () => {
            for (const file of selectedFiles) {
                const filename = props.dailyExports.find(e => e.id === file)?.filename;
                if (!filename) {
                    toast.error('Failed to download file');
                    return;
                }
                const encodedFilename = btoa(filename);
                try {
                    const resp = await fetch(`/api/case-management-api/v1/studies/${props.studyKey}/data-exporter/responses/daily-exports/${encodedFilename}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (resp.status !== 200) {
                        toast.error('Failed to download file', {
                            description: resp.statusText
                        });
                        return;
                    }
                    const blob = await resp.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const downloadFilename = resp.headers.get('Content-Disposition')?.split('filename=')[1] || filename;
                    a.download = downloadFilename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    toast.success(downloadFilename + ' downloaded');
                } catch (e) {
                    console.error(e);
                    toast.error('Failed to download file');
                }
            }
        });
    }

    let content = null;
    if (props.dailyExports.length === 0) {
        content = <div>
            <p className=''>No daily exports available</p>
            <p className='text-xs text-muted-foreground'>
                Either the study has no daily exports configured or there is no data for the configured survey within the retention period.
            </p>
        </div>;
    } else {
        content = (
            <div>
                <div className="mb-4">
                    <LoadingButton
                        onClick={handleDownload}
                        disabled={selectedFiles.length === 0}
                        isLoading={isPending}
                    >
                        Download Selected ({selectedFiles.length})
                    </LoadingButton>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={selectedFiles.length === props.dailyExports.length}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all files"
                                />
                            </TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Survey Key</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.dailyExports.map((file) => (
                            <TableRow key={file.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectFile(file.id)
                                }}
                                className='cursor-pointer h-6'
                            >
                                <TableCell className='flex items-center'>
                                    <Checkbox
                                        checked={selectedFiles.includes(file.id)}
                                        aria-label={`Select file ${file.surveyKey}`}
                                    />
                                </TableCell>
                                <TableCell>{file.date}</TableCell>
                                <TableCell>{file.surveyKey}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
    return (
        <Card className='p-4'>
            {content}
        </Card>
    );
};

export default DailExportsClient;
