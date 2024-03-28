import { AlertCircle } from 'lucide-react';
import React from 'react';

interface ContentPreviewProps {
    decodedTemplate?: string;
}

const ContentPreview: React.FC<ContentPreviewProps> = (props) => {
    return (
        <div>
            <h4
                className='text-sm font-semibold mb-2'
            >Preview</h4>
            <div className='border border-dashed border-neutral-200 rounded-md flex flex-col grow'>

                {props.decodedTemplate ?
                    <iframe
                        src={`data:text/html;charset=UTF-8,${encodeURIComponent(props.decodedTemplate)}`}
                        style={{ width: '100%', height: '500px' }}
                        className='overscroll-contain'
                        title="Email template preview"
                    /> : <div className='flex flex-col items-center justify-center h-[500px]'>
                        <p className='font-bold text-lg text-warning'>No template</p>
                        <AlertCircle className='mt-2 text-4xl text-warning-300' />
                    </div>}
            </div>
        </div>
    );
};

export default ContentPreview;
