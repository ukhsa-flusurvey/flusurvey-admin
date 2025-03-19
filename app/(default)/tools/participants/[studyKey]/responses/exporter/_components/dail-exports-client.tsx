'use client';

import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { toast } from 'sonner';

export interface DailyExport {
    id: number;
    filename: string;
    surveyKey: string;
    date: string;
    type: string;
}

interface DailExportsClientProps {
    studyKey: string;
    type: string;
    dailyExports: Array<DailyExport>;
}

const mapExportFormat = (type: string) => {
    switch (type) {
        case 'wide':
            return 'CSV (wide)';
        case 'long':
            return 'CSV (long)';
        case 'json':
            return 'JSON';
        default:
            return type;
    }
}

const DailExportsClient: React.FC<DailExportsClientProps> = (props) => {
    const [selectedFiles, setSelectedFiles] = useState<number[]>([])
    const [isPending, startTransition] = React.useTransition();

    const [selectedSurveyKey, setSelectedSurveyKey] = useState<string>("all")
    const [selectedFormat, setSelectedFormat] = useState<string>("all")
    const [dateRange, setDateRange] = useState<string>("all")

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
            let downloadCount = 0;
            for (const file of selectedFiles) {
                const filename = props.dailyExports.find(e => e.id === file)?.filename;
                if (!filename) {
                    toast.error('Failed to download file');
                    return;
                }
                const encodedFilename = btoa(filename);
                try {
                    let baseUrl = `/api/case-management-api/v1/studies/${props.studyKey}/data-exporter/responses/daily-exports/${encodedFilename}`;
                    if (props.type === 'confidential-responses') {
                        baseUrl = `/api/case-management-api/v1/studies/${props.studyKey}/data-exporter/confidential-responses/${encodedFilename}`;
                    }
                    const resp = await fetch(baseUrl, {
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

                    // Clean up
                    setTimeout(() => {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 100);
                    downloadCount++;
                    console.log(`${downloadCount}: ${filename}`);
                    // Add a small delay between downloads
                    await new Promise(resolve => setTimeout(resolve, 200));
                } catch (e) {
                    console.error(e);
                    toast.error('Failed to download file');
                }
            }
            toast.success(`${downloadCount} files downloaded.`);
        });
    }

    const allFiles = props.dailyExports;

    const uniqueSurveyKeys = Array.from(new Set(allFiles.map((item) => item.surveyKey)))
    const uniqueFormats = Array.from(new Set(allFiles.map((item) => item.type)))

    const filterData = () => {
        return allFiles.filter((item) => {
            const surveyKeyMatch = selectedSurveyKey === "all" || item.surveyKey === selectedSurveyKey
            const formatMatch = selectedFormat === "all" || item.type === selectedFormat

            if (dateRange === "all") return surveyKeyMatch && formatMatch

            const itemDate = new Date(item.date)
            const today = new Date()
            const diffTime = Math.abs(today.getTime() - itemDate.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            let dateMatch = true
            if (dateRange === "2") dateMatch = diffDays <= 2
            if (dateRange === "7") dateMatch = diffDays <= 7
            if (dateRange === "30") dateMatch = diffDays <= 30

            return surveyKeyMatch && formatMatch && dateMatch
        })
    }

    const filteredData = filterData()

    let content = null;
    if (filteredData.length === 0) {
        content = <div>
            <p className=''>No file exports available for the current selection</p>
            <p className='text-xs text-muted-foreground'>
                Either the study has no file exports configured or there is no data for the configured filter within the retention period.
            </p>
        </div>;
    } else {
        content = (
            <div>


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
                            <TableHead>Export format</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((file) => (
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
                                <TableCell>
                                    <span className='text-xs text-muted-foreground uppercase'>
                                        {mapExportFormat(file.type)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
    return (
        <Card className='p-4 relative'>
            <div className="flex gap-4 mb-4 justify-end">
                <div
                    className={cn("grow",
                        { "hidden": selectedFiles.length === 0 },

                    )}>
                    <LoadingButton
                        onClick={handleDownload}
                        disabled={selectedFiles.length === 0}
                        isLoading={isPending}
                    >
                        Download Selected ({selectedFiles.length})
                    </LoadingButton>
                </div>

                {props.type !== 'confidential-responses' && <>

                    <Select value={selectedSurveyKey} onValueChange={setSelectedSurveyKey}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Survey Key" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Survey Keys</SelectItem>
                            {uniqueSurveyKeys.map((key) => (
                                <SelectItem key={key} value={key}>
                                    {key}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Formats</SelectItem>
                            {uniqueFormats.map((format) => (
                                <SelectItem key={format} value={format}>
                                    {format}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Dates</SelectItem>
                            <SelectItem value="2">Last 2 Days</SelectItem>
                            <SelectItem value="7">Last 7 Days</SelectItem>
                            <SelectItem value="30">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </>}
            </div>
            {content}
        </Card>
    );
};

export default DailExportsClient;
