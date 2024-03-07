'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useCopyToClipboard } from 'usehooks-ts';
import { toast } from 'sonner';

interface CopyIdToClipboadProps {
    participantId: string;
}


const CopyIdToClipboad: React.FC<CopyIdToClipboadProps> = (props) => {
    const [copiedText, copyToClipboard] = useCopyToClipboard();

    return (
        <Button
            variant={'ghost'}
            size='icon'
            className='size-6'
            onClick={() => {
                copyToClipboard(props.participantId)
                toast.success('Participant ID copied to clipboard');
            }}
        >
            <Copy className='size-4' />
        </Button>
    );
};

export default CopyIdToClipboad;
