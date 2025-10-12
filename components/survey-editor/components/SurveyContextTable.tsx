import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StudyVariable } from '@/utils/server/types/study-variables';
import React from 'react';
import { SurveyContext as ContextValues } from 'survey-engine/data_types';

type SurveyContextTableProps = { contextValues: ContextValues };

export const SurveyContextTable: React.FC<SurveyContextTableProps> = ({ contextValues }) => {

    const { isLoggedIn, participantFlags, studyVariables } = contextValues;
    const studyVariableEntries: Record<string, string> = Object.fromEntries(
        Object.entries(studyVariables || {}).map(([k, v]) => {
            if (v.type === 'date') {
                const dateVal = v.value instanceof Date ? v.value : new Date(String((v as StudyVariable).value));
                return [k, isNaN(dateVal.getTime()) ? '' : dateVal.toISOString().slice(0, 10)];
            }
            return [k, String((v as StudyVariable).value)];
        })
    );

    return (
        <>
            <Table className='text-xs'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='p-0 h-6 pl-2'>Variable</TableHead>
                        <TableHead className='p-0 pl-2 h-6'>Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className='font-mono'>
                        <TableCell className='p-0 h-6 pl-2'>is logged in</TableCell>
                        <TableCell className='p-0 pl-2 h-6'>{isLoggedIn?.toString()}</TableCell>
                    </TableRow>

                    <TableRow className='bg-muted'>
                        <TableCell
                            className='p-0 px-2 h-6 font-bold'
                            colSpan={2}
                        >
                            participant flags:
                        </TableCell>
                    </TableRow>
                    {Object.entries(participantFlags ?? {}).length === 0 && (
                        <TableRow >
                            <TableCell
                                className='p-0 h-6 pl-2 text-center'
                                colSpan={2}
                            >
                                no participant flags
                            </TableCell>
                        </TableRow>
                    )}
                    {Object.entries(participantFlags ?? {}).map(([key, value]) => (
                        <TableRow key={key} className='font-mono'>
                            <TableCell className='p-0 pl-2 h-6'>{key}</TableCell>
                            <TableCell className='p-0 pl-2 h-6'>{value?.toString()}</TableCell>
                        </TableRow>
                    ))}

                    <TableRow className='bg-muted'>
                        <TableCell
                            colSpan={2}
                            className='p-0 px-2 h-6 font-bold'>
                            study variables:
                        </TableCell>
                    </TableRow>
                    {Object.entries(studyVariableEntries ?? {}).length === 0 && (
                        <TableRow>
                            <TableCell
                                className='p-0 pl-2 h-6 text-center'
                                colSpan={2}
                            >
                                no study variables
                            </TableCell>
                        </TableRow>
                    )}

                    {Object.entries(studyVariableEntries ?? {}).map(([key, value]) => (
                        <TableRow key={key} className='font-mono'>
                            <TableCell className='p-0 pl-2 h-6'>{key}</TableCell>
                            <TableCell className='p-0 pl-2 h-6'>{value?.toString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );

}
