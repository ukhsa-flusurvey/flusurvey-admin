import React from 'react'
import Link from 'next/link'
import { Card } from './ui/card'
import { ChevronRight } from 'lucide-react'



const LinkCard = (props: { href: string, title: string, description: string, icon: React.ReactNode }) => {
    return (
        <Link
            href={props.href}
            prefetch={false}
        >
            <Card
                className="bg-white hover:bg-slate-50 cursor-pointer transition-colors duration-200 ease-in-out"

            >
                <div className="p-3 flex items-center gap-3">
                    <div className="text-neutral-600">
                        {props.icon}
                    </div>
                    <div className="grow">
                        <h3 className="font-semibold text-lg">{props.title}</h3>
                        <p className="text-neutral-600 text-xs">{props.description}</p>
                    </div>
                    <div >
                        <ChevronRight className="text-neutral-400 size-5" />
                    </div>
                </div>
            </Card>
        </Link>)
}

export default LinkCard;
