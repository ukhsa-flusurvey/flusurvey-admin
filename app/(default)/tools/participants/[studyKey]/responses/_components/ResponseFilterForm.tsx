'use client';

import React from 'react';

interface ResponseFilterFormProps {
    surveyKeys: string[];
}

const ResponseFilterForm: React.FC<ResponseFilterFormProps> = (props) => {
    return (
        <div>
            <div>
                Select survey key
            </div>
            <div>
                Later than
            </div>
            <div>
                older than
            </div>
        </div>
    );
};

export default ResponseFilterForm;
