import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Page() {

    return (
        <div
            className="h-full w-full py-6 flex flex-col gap-4" >
            <div className="h-12 bg-slate-100">
                {'<- back button'}
            </div>

            <div className="grow flex overflow-hidden">
                <Card
                    variant={'opaque'}
                    className="w-full h-full flex flex-col overflow-hidden"
                >
                    <div className="shrink-0 bg-green-300 py-3 ">
                        Header and search
                    </div>
                    <div className="grow flex overflow-hidden">
                        <div className="bg-red-50 h-full w-64 rounded-lg relative ">
                            <ScrollArea
                                className="h-full overflow-y-auto pb-12 "
                            >
                                <div className="space-y-1">


                                    {Array.from({ length: 20 }, (_, index) => (
                                        <div key={index}
                                            className="bg-red-500 h-20 w-full rounded-lg"
                                        >Item {index + 1}</div>
                                    ))}
                                </div>

                                <ScrollBar />
                            </ScrollArea>
                            <div className="bg-purple-100 w-full h-12 absolute bottom-0 flex items-center justify-center">
                                Pagination
                            </div>

                        </div>
                        <div className="grow h-full overflow-auto">

                        </div>
                    </div>
                </Card >
            </div>

        </div >
    );
}
