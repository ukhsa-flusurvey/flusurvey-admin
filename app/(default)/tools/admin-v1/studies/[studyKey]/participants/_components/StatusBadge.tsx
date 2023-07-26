import clsx from 'clsx';
import React from 'react';


const StatusBadge = ({ status }: { status: string }) => {
    return (
        <span className={clsx(
            'block px-2 py-1 rounded',
            'text-xs font-bold',
            'bg-blue-100 ',
            {
                'bg-green-100 text-green-800': status === 'active',
                'bg-red-100 text-red-800': status === 'accountDeleted'
            },

        )}>
            {status}
        </span>
    )
}

export default StatusBadge;
