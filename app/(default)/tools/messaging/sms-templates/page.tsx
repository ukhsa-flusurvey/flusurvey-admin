import { ArrowLeft } from "lucide-react";

export default function Page() {

    return (
        <div className="flex items-center p-12 justify-center">
            <p className="bg-white/80 backdrop-blur-md  p-6 text-2xl rounded-lg flex items-center">
                <span>
                    <ArrowLeft className="size-8 me-3" />
                </span>
                Select a template from the left to view its content or edit it.
            </p>
        </div>
    );
}
