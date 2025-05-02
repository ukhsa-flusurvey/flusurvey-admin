import { MessageSchedule } from '@/utils/server/types/messaging';
import { formatDistanceStrict } from 'date-fns';
import { dateFromTimestamp } from '../utils';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, RefreshCw } from 'lucide-react';
import { LinkMenuItem } from '@/components/LinkMenu';
import ClientSideDateTimeDisplay from './client-side-datetime-display';


const ScheduleCard: React.FC<{ schedule: MessageSchedule }> = ({ schedule }) => {
    return (
        <LinkMenuItem
            href={`/tools/messaging/schedules/${schedule.id}`}
        >

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
                        <ClientSideDateTimeDisplay dateTime={dateFromTimestamp(schedule.nextTime)} />
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
        </LinkMenuItem >
    )
}

export default ScheduleCard;
