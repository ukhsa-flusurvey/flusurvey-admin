"use client"

import Filepicker from '@/components/inputs/Filepicker';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { z } from 'zod';

export const participantInfoSchema = z.array(z.record(
    z.string(),
    z.string()
)).min(1)

interface ParticipantInfoUploaderProps {
    values: Record<string, string>[];
    onChange: (newValues: Record<string, string>[]) => void;
}

const detectDelimiter = (text: string): string => {
    const firstLine = text.split('\n')[0]
    const delimiters = [',', ';', '\t', '|']
    return delimiters.reduce((a, b) =>
        (firstLine.split(a).length > firstLine.split(b).length ? a : b)
    )
}

const ParticipantInfoUploader: React.FC<ParticipantInfoUploaderProps> = (props) => {
    return (
        <div>
            <Filepicker id='participant-info-uploader'
                label='Participant info CSV'
                accept={{
                    'text/csv': ['.csv'],
                }}
                onChange={(files) => {
                    if (!files || files.length === 0) {
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const text = e.target?.result;
                        if (typeof text === 'string') {
                            const lines = text.split('\n');
                            if (lines.length < 2) {
                                props.onChange([]);
                                return;
                            }
                            const delimiter = detectDelimiter(text);
                            const keys = lines[0].split(delimiter).map(k => k.trim()).filter(k => k.length > 0);
                            const data = lines.filter(l => l.length > 0).slice(1).map(line => {
                                const values = line.split(delimiter).map(v => v.trim());
                                if (values.length !== keys.length) {
                                    return null;
                                }
                                const obj: Record<string, string> = {};
                                for (let i = 0; i < keys.length; i++) {
                                    obj[keys[i]] = values[i];
                                }
                                return obj;
                            });
                            props.onChange(data.filter(d => d !== null) as Record<string, string>[]);
                        } else {
                            props.onChange([]);
                        }
                    }
                    reader.readAsText(files[0]);
                }}
            />

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="csv-preview">
                    <AccordionTrigger
                        className='font-normal text-xs text-muted-foreground'
                    >
                        {props.values.length < 1 ? 'Select the CSV file with the participant IDs and their information.' : `CSV with (${props.values.length} rows)`}

                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="max-h-96 overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {props.values.length > 0 && Object.keys(props.values[0]).map((header, index) => (
                                            <TableHead key={index}>{header}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {props.values.map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            {Object.values(row).map((cell, cellIndex) => (
                                                <TableCell key={cellIndex}>{cell}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default ParticipantInfoUploader;
