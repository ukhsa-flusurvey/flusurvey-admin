import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { BsHouseFill } from 'react-icons/bs';

const Breadcrumbs = ({ links, homeLink }: {
    homeLink?: string;
    links: Array<{
        title: string | React.ReactNode;
        href?: string;
    }>
}) => {
    // insert home link
    links.unshift({
        href: homeLink,
        title: <BsHouseFill />
    });

    return (
        <nav className="flex items-center">
            <ul className="flex items-center">
                {links.map((item, index) => (
                    <li key={index} className="flex items-center text-small">
                        {
                            item.href !== undefined ? <Link href={item.href}
                                className="text-default-600 hover:text-default-700 hover:underline"
                            >
                                {item.title}
                            </Link> :
                                <span className="text-default-600">
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
