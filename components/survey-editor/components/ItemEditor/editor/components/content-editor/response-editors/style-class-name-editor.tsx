import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const StyleClassNameEditor = (props: {
    styles: { key: string, value: string }[],
    styleKey: string,
    label: string,
    onChange: (key: string, value: string | undefined) => void
}) => {
    return <div className="flex items-center gap-2" data-no-dnd="true">
        <Label htmlFor={'input-' + props.styleKey} className="text-xs">
            {props.label}
        </Label>
        <Input
            id={'input-' + props.styleKey}
            value={props.styles?.find(st => st.key === props.styleKey)?.value ?? ""}
            onChange={(e) => { props.onChange(props.styleKey, e.target.value) }}
        />
    </div>
}