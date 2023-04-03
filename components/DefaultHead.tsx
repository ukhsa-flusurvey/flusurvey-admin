import Head from 'next/head';
import React from 'react';

interface HeadProps {
    title?: string;
    description?: string;
}

const DefaultHead: React.FC<HeadProps> = (props) => {
    return (
        <Head >
            <title>{props.title}</title>
            <meta name="description" content={props.description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
};

export default DefaultHead;
