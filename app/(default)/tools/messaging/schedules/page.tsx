import { MessageSchedule } from "@/utils/server/types/messaging";
import { getMessageSchedules } from "./utils";
import { ArrowPathIcon, CalendarDaysIcon, EllipsisVerticalIcon, PlusIcon, StopCircleIcon } from "@heroicons/react/24/outline";
import PrimaryOutlinedLink from "@/components/buttons/PrimaryOutlineLink";
import Link from "next/link";
import { format, formatDistanceStrict } from "date-fns";
import { redirect } from "next/navigation";


const dateFromTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000);
}

const formatTimestamp = (timestamp: number) => {
    return format(dateFromTimestamp(timestamp), 'yyyy-MM-dd HH:mm');
}

const ScheduleCard: React.FC<{ schedule: MessageSchedule }> = ({ schedule }) => {
    return (
        <Link
            prefetch={false}
            className="bg-white rounded shadow p-4 mb-4 flex flex-col gap-2 group hover:bg-gray-50"
            href={`/tools/admin-v1/messaging/schedules/${schedule.id}`}
        >
            <div className="flex items-center gap-2">
                <span className="px-4 py-1 rounded-full text-sm bg-slate-200">  {schedule.template.messageType}</span>
                <div className="text-gray-500 divide-x-2">
                    <span className="pe-2">{schedule.type}</span>
                    {schedule.studyKey && <span className="px-2">{schedule.studyKey}</span>}
                </div>
                <span className="grow"></span>
                <span className="flex items-center group-hover:underline">
                    <EllipsisVerticalIcon className="h-4 w-4 text-gray-500 me-1" />
                </span>
            </div>

            <h3 className="font-bold group-hover:underline">
                {schedule.label}
            </h3>
            <div className="flex gap-4">
                <div className="flex items-center">
                    <span className="text-gray-400">
                        <CalendarDaysIcon className="w-5 h-5" />
                    </span>
                    <span className="px-1">
                        {formatTimestamp(schedule.nextTime)}
                    </span>
                </div>

                <div className="flex items-center">
                    <span className="text-gray-400">
                        <ArrowPathIcon className="w-5 h-5" />
                    </span>
                    <span className="px-1">
                        {formatDistanceStrict(
                            dateFromTimestamp(schedule.nextTime),
                            dateFromTimestamp(schedule.nextTime + schedule.period)
                        )}
                    </span>
                </div>

                {schedule.until && (
                    <div className="flex items-center">
                        <span className="text-gray-400">
                            <StopCircleIcon className="w-5 h-5" />
                        </span>
                        <span className="px-1">
                            {formatTimestamp(schedule.until)}
                        </span>
                    </div>)}
            </div>
        </Link>
    )
}


export default async function Page() {
    let schedules: MessageSchedule[];
    try {
        schedules = await getMessageSchedules();
    } catch (e) {
        redirect('/auth/login?callbackUrl=/tools/admin-v1/messaging/schedules')
    }

    // console.log(schedules)
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Message schedules</h1>
            <div className="divide-y">
                {
                    schedules.map((schedule: MessageSchedule) => (
                        <ScheduleCard key={schedule.id} schedule={schedule} />
                    ))
                }
            </div>
            {
                (!schedules || schedules.length === 0) && (
                    <div className="text-gray-500">
                        No message schedules found
                    </div>
                )
            }
            <div className="mt-4">
                <PrimaryOutlinedLink
                    className="text-sm"
                    href="/tools/admin-v1/messaging/schedules/new"
                >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Create new message schedule
                </PrimaryOutlinedLink>
            </div>
        </div>
    )
}
