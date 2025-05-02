import React from 'react';
import Breadcrumbs from './Breadcrumbs';

interface SimpleBreadcrumbsPageLayoutProps {
    children: React.ReactNode;
    links: Array<{
        title: string | React.ReactNode;
        href?: string;
    }>
}

const SimpleBreadcrumbsPageLayout: React.FC<SimpleBreadcrumbsPageLayoutProps> = (props) => {
    return (
        <div className="px-6 overflow-y-auto">
            <div className="pt-3">
                <Breadcrumbs
                    links={props.links}
                />
            </div>
            <main className="py-6">
                {props.children}
            </main>
        </div>
    );
};

export default SimpleBreadcrumbsPageLayout;
