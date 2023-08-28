import { Spinner } from '@nextui-org/spinner';
import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center w-full py-unit-lg">
            <Spinner color="primary" />
        </div>
    );
};

export default Loading;
