import { Study } from "@/utils/server/types/studyInfos"

import { LinkMenuItem } from "./LinkMenu";
import { Badge } from "./ui/badge";
import { Dot } from "lucide-react";



const StudyCard = (props: { study: Study, baseURL: string }) => {
    const url = `${props.baseURL}/${props.study.key}`;

    return <LinkMenuItem
        href={url}
    >
        <div className=' flex'>
            <div className='grow'>
                <div className='text-lg font-bold'>
                    {props.study.key}
                    {props.study.props.systemDefaultStudy && <Badge variant='default' className='ml-2'>Default</Badge>}
                </div>
                <div className='text-xs flex items-center mt-2'>
                    <span className='me-1 text-neutral-500'>Participants: </span>
                    <span>{(props.study.stats.participantCount || 0) + (props.study.stats.tempParticipantCount || 0)}</span>
                    <span><Dot /> </span>
                    <span className='me-1 text-neutral-500'>Responses: </span>
                    <span>{props.study.stats.responseCount || 0}</span>
                </div>

            </div>
            <div className='flex items-center gap-3'>
                <Badge
                    variant='outline'
                    color={
                        props.study.status === 'active' ? 'success' : 'default'
                    }>
                    {props.study.status}
                </Badge>
            </div>
        </div>
    </LinkMenuItem>
}

export default StudyCard;
