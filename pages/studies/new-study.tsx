import AuthManager from '@/components/AuthManager';
import StudyPropertyEditor from '@/components/study-property-editor/StudyPropertyEditor';
import { Study } from '@/utils/server/types/studyInfos';
import React from 'react';
import { Expression, LocalizedString } from 'survey-engine/data_types';



const NewStudy: React.FC = () => {


    const createStudy = async (study: Study) => {
        const response = await fetch('/api/studies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(study),
        });
        const data = await response.json();
        console.log(data);
    };



    return (
        <AuthManager>
            <div className='bg-gray-100 p-6'>
                <StudyPropertyEditor
                    onSubmit={(study) => {
                        console.log(study);
                        createStudy(study);
                    }}
                />
            </div>
        </AuthManager >
    );
};

export default NewStudy;
