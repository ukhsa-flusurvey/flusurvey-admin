import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";


interface MarkdownRendererProps {
    className?: string;
    children: string;
}

const SimpleMarkdownRenderer: React.FC<MarkdownRendererProps> = (props) => {
    return (
        <ReactMarkdown
            className={props.className}
            components={{
                a: ({ node, ...props }) => {
                    return <a
                        className='text-primary hover:underline'
                        href={props.href as string} {...props} />
                }
            }}
            rehypePlugins={[
                rehypeRaw
            ]}
        >
            {props.children}
        </ReactMarkdown>
    );
};

export default SimpleMarkdownRenderer;
