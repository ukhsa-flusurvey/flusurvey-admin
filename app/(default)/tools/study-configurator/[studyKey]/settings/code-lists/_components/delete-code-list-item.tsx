'use client'

import React from 'react';

interface DeleteCodeListItemProps {
    studyKey: string;
    listKey: string;
    code: string;
}

const DeleteCodeListItem: React.FC<DeleteCodeListItemProps> = (props) => {
    return (
        <p>DeleteCodeListItem</p>
    );
};

export default DeleteCodeListItem;
