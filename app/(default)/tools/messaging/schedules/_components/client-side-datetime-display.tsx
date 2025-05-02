'use client'

import { format } from "date-fns";
import React from "react";

interface ClientSideDateTimeDisplayProps {
    dateTime: Date;
}

const ClientSideDateTimeDisplay: React.FC<ClientSideDateTimeDisplayProps> = (props) => {
    const [renderedTime, setRenderedTime] = React.useState(format(props.dateTime, 'yyyy-MM-dd HH:mm'))

    React.useEffect(() => {
        setRenderedTime(format(props.dateTime, 'yyyy-MM-dd HH:mm'))
    }, [props.dateTime]);

    return (
        <time dateTime={props.dateTime.toISOString()}>
            {renderedTime}
        </time>
    )
}

export default ClientSideDateTimeDisplay;
