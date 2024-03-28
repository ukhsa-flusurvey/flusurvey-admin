import { BsInfoCircle } from "react-icons/bs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";



const TwoColumnsWithCards: React.FC<{
    label: string, description: string,
    infoboxContent?: React.ReactNode,
    children: React.ReactNode
}> = (props) => {
    return (
        <div className='flex flex-col sm:flex-row gap-4 my-6 group'>
            <div className='min-w-[300px] w-full sm:w-[300px]'>
                <h3 className='text-xl font-bold'>{props.label}
                    {props.infoboxContent && (

                        <Popover >
                            <PopoverTrigger>
                                <Button variant='ghost'
                                    size='icon'
                                    aria-label="Show additional info"
                                >
                                    <BsInfoCircle />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-[500px]">
                                {props.infoboxContent}
                            </PopoverContent>
                        </Popover>
                    )
                    }
                </h3>
                <p className='text-sm text-gray-500 group-hover:text-black'>{props.description}</p>

            </div>
            <Card
                variant={'opaque'}
                className='flex-1'
            >
                <CardContent>
                    {props.children}
                </CardContent>
            </Card>
        </div>
    );
}

export default TwoColumnsWithCards;
