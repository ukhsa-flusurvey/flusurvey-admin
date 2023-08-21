import { MessageSchedule } from '@/utils/server/types/messaging';
import { format, formatDistanceStrict } from 'date-fns';
import { BsArrowClockwise, BsCalendarDate, BsChevronRight } from 'react-icons/bs';
import { dateFromTimestamp, formatTimestamp } from './utils';
import { Card } from '@nextui-org/card';
import Link from 'next/link';
import { Chip } from '@nextui-org/react';

const ScheduleCard: React.FC<{ schedule: MessageSchedule }> = ({ schedule }) => {
    return (
        <Card className="bg-white group  hover:bg-default-100"
            isPressable
            as={Link}
            href={`/tools/messaging/schedules/editor?id=${schedule.id}`}
        >
            <div className='p-unit-md flex gap-unit-md items-center'>
                <div className='grow'>
                    <div className="flex items-center gap-unit-lg">
                        <Chip size='sm'>
                            {schedule.template.messageType}
                        </Chip>

                        <div className="text-default-600 divide-x-2">
                            <span className="pe-2">{schedule.type}</span>
                            {schedule.studyKey && <span className="px-2">{schedule.studyKey}</span>}
                        </div>
                    </div>

                    <h3 className="font-bold group-hover:underline my-unit-1 text-large">
                        {schedule.label}
                    </h3>
                    <div className="flex gap-4">
                        <div className="flex items-center">
                            <span className="text-default-400 me-1">
                                <BsCalendarDate className="" />
                            </span>
                            <span className="px-1">
                                {formatTimestamp(schedule.nextTime)}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <span className="text-default-400">
                                <BsArrowClockwise className="" />
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
                    <BsChevronRight className="text-default-400 text-large" />
                </div>
            </div>
        </Card>
    )
}

export default ScheduleCard;
