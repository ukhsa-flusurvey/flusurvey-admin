import { Asterisk } from 'lucide-react';
import React from 'react';

interface TimelineProps {
    items: React.ReactNode[];
}

const Timeline: React.FC<TimelineProps> = (props) => {
    const itemCount = props.items.length;

    return (
        <div className='pl-[15px]'>
            <ol className="relative border-l-2 border-neutral-300 space-y-[42px]">
                {props.items.map((item, index) => {
                    const isLast = index === itemCount - 1;
                    return (
                        <li key={index}
                            className="ml-[36px] relative"
                        >
                            {isLast &&
                                <span className="absolute flex items-center justify-center w-6 h-full bg-white  -left-[40px] ring-white">
                                </span>
                            }
                            {(index === 0) ?
                                <span className="absolute flex items-center justify-center w-[30px] h-[30px] bg-cyan-800 rounded-full -left-[51px] ring-4 ring-white">
                                    <Asterisk className='text-white size-5' />
                                </span>
                                :
                                <span className="absolute flex items-center justify-center w-[20px] h-[20px] bg-neutral-300 rounded-full -left-[47px] top-[2px] ring-2 ring-white">

                                </span>
                            }
                            {item}
                        </li>
                    )
                })}
            </ol>
        </div>
    );
};

export default Timeline;

