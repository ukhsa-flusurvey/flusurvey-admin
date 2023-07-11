import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const Breadcrumbs = ({ links }: {
    links: Array<{
        title: string;
        href?: string;
    }>
}) => {
    return (
        <nav className="flex items-center">
            <ul className="flex">
                {links.map((item, index) => (
                    <li key={index} className="flex">
                        {
                            item.href !== undefined ? <Link href={item.href}
                                className="text-gray-500 hover:text-gray-700 hover:underline"
                            >
                                {item.title}
                            </Link> :
                                <span className="text-gray-500">
                                    {item.title}
                                </span>
                        }

                        {index !== links.length - 1 && (
                            <>
                                <ChevronRightIcon className='w-4 mx-2 text-gray-500 ' />
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;
