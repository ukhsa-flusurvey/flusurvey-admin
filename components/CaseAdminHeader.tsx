import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = false;


const CaseAdminHeader: React.FC = async () => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    return (
        <Link
            prefetch={false}
            href='/'
            className='flex border-l-[5px] border-l-cyan-800 px-4'>
            <h1 className='text-2xl'>
                <span className='font-normal text-cyan-800 text-lg'>CASE ADMIN</span> <br />
                <span className='font-semibold tracking-wider'>{appName} {process.env.NAME_SUFFIX}</span>
            </h1>
        </Link>
    );
};

export default CaseAdminHeader;
