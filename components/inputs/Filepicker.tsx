import React, { useEffect } from 'react';
import { Accept, useDropzone } from "react-dropzone";

interface FilepickerProps {
    accept?: Accept;
    onChange: (files: File[]) => void;
}

const Filepicker: React.FC<FilepickerProps> = (props) => {
    const { onChange } = props;
    const {
        acceptedFiles,
        isDragActive,
        getRootProps, getInputProps } = useDropzone({
            accept: props.accept,
            // disabled: true
        });


    useEffect(() => {
        onChange(acceptedFiles);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acceptedFiles]);

    return (
        <div
            className="bg-blue-100 border-2 border-gray-400 rounded-lg p-4 hover:bg-blue-200 outline-blue-300"
            {...getRootProps()}>
            <input
                className="bg-blue-100 border-2 border-gray-400 rounded-lg p-4"
                {...getInputProps()} />
            <p>Drag and drop some files here, or click to select files</p>
        </div>
    );
};

export default Filepicker;
