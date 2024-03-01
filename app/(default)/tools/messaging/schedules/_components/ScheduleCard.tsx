import { MessageSchedule } from '@/utils/server/types/messaging';
import { formatDistanceStrict } from 'date-fns';
import { dateFromTimestamp, formatTimestamp } from '../utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, ChevronRight, RefreshCw } from 'lucide-react';


const ScheduleCard: React.FC<{ schedule: MessageSchedule }> = ({ schedule }) => {
    return (
        <li>
            <Link
                href={`/tools/messaging/schedules/${schedule.id}`}
                prefetch={false}
                className='flex gap-4 items-center px-6 py-4 bg-slate-100 hover:bg-gray-100 transition-colors duration-200 ease-in-out cursor-pointer'
            >
                <div className='grow'>
                    <div className="flex items-center gap-6">
                        <Badge
                            className='text-xs'
                        >
                            {schedule.template.messageType}
                        </Badge>

                        <div className="text-neutral-700 divide-x-2">
                            <span className="pe-2">{schedule.type}</span>
                            {schedule.studyKey && <span className="px-2">{schedule.studyKey}</span>}
                        </div>
                    </div>

                    <h3 className="font-bold group-hover:underline my-1 text-lg">
                        {schedule.label}
                    </h3>
                    <div className="flex gap-4">
                        <div className="flex items-center">
                            <span className="text-neutral-400 me-1">
                                <CalendarClock className="size-5" />
                            </span>
                            <span className="px-1">
                                {formatTimestamp(schedule.nextTime)}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <span className="text-neutral-400">
                                <RefreshCw className="size-5" />
                            </span>
                            <span className="px-1">
                                {formatDistanceStrict(
                                    dateFromTimestamp(schedule.nextTime),
                                    dateFromTimestamp(schedule.nextTime + schedule.period)
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <ChevronRight className="text-neutral-600 size-6" />
                </div>
            </Link>
        </li>
    )
}

export default ScheduleCard;
