import React from 'react';

interface CaseAdminHeaderProps {
    appName: string;
}

const CaseAdminHeader: React.FC<CaseAdminHeaderProps> = (props) => {
    return (
        <div className='border-l-[5px] border-l-cyan-800 px-4'>
            <h1 className='text-2xl'>
                <span className='font-normal text-cyan-800 text-lg'>CASE ADMIN</span> <br />
                <span className='font-semibold tracking-wider'>{props.appName}</span>
            </h1>
        </div>
    );
};

export default CaseAdminHeader;
