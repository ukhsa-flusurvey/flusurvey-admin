import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { participantStudyStatus } from "../utils";
import { FlagTriangleRight } from "lucide-react";


const StatusEditPopover = (props:
    {
        status: string,
        onStatusChange: (status: string) => void
    }) => {
    const [open, setOpen] = useState(false);

    const onStatusChange = (status: string) => {
        props.onStatusChange(status);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant='ghost'
                    className='size-6 rounded-full'
                >
                    <PencilIcon className='size-3' />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
                <div className='flex flex-col gap-2'>
                    <Field>
                        <FieldLabel className='flex items-center gap-2'>
                            <span className='text-neutral-400'><FlagTriangleRight className='size-3' /></span>
                            Status
                        </FieldLabel>

                        <FieldContent>
                            <Select value={props.status} onValueChange={(value) => onStatusChange(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select status' />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(participantStudyStatus).map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FieldContent>
                    </Field>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default StatusEditPopover;
