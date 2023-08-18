'use client';

import Filepicker from '@/components/inputs/Filepicker';
import { Input } from '@nextui-org/react';
import React from 'react';

interface StudyDashboardProps {
    studyKey: string;
}

const StudyDashboard: React.FC<StudyDashboardProps> = (props) => {
    return (
        <div className='flex flex-col gap-unit-lg'>
            <Input
                label='Study name'
                placeholder='Study name'
                labelPlacement='outside'
                variant='bordered'
            >
            </Input>
            <Filepicker
                id='test'
                label='Upload a file'
                onChange={(files) => {
                    console.log(files);

                }}
            />
        </div>
    );
};

export default StudyDashboard;
