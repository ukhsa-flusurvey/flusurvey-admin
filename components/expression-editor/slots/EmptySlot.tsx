import SlotLabel from "../components/SlotLabel";
import SlotTypeSelector, { SlotTypeGroup } from "../components/SlotTypeSelector";
import { ExpressionCategory, ExpressionDef, SlotDef, SlotInputDef } from "../utils";

interface EmptySlotProps {
    slotDef: SlotDef;
    expRegistry: {
        expressionDefs: ExpressionDef[],
        categories: ExpressionCategory[]
        builtInSlotTypes: SlotInputDef[],
    };
    onSelect: (slotTypeId?: string) => void;
}

const EmptySlot: React.FC<EmptySlotProps> = (props) => {
    const groups: Array<SlotTypeGroup> = []

    // add expression types:
    const allowExpressionTypes: string[] = [];
    const excludedExpressions: string[] = [];
    let allowsExpressions = false;
    props.slotDef.allowedTypes?.forEach((at) => {
        if (at.type === 'expression') {
            allowsExpressions = true;
            if (at.allowedExpressionTypes !== undefined) {
                allowExpressionTypes.push(...at.allowedExpressionTypes)
            }
            if (at.excludedExpressions !== undefined) {
                excludedExpressions.push(...at.excludedExpressions)
            }
        }
    })


    props.expRegistry.categories.forEach((category) => {
        const currentGroup: SlotTypeGroup = {
            id: category.id,
            label: category.label,
            slotTypes: []
        }

        props.expRegistry.builtInSlotTypes.forEach((builtIn) => {
            if (props.slotDef.allowedTypes?.find(at => at.type === builtIn.type)
                && builtIn.categories?.includes(category.id)
            ) {
                currentGroup.slotTypes.push({
                    id: builtIn.id,
                    label: builtIn.label || builtIn.type,
                    icon: builtIn.icon,
                    color: builtIn.color,
                })
            }
        })

        if (allowsExpressions) {
            // collect allowed types into groups from registry
            props.expRegistry.expressionDefs.forEach((expDef) => {
                if (
                    expDef.categories.includes(category.id)
                    && allowExpressionTypes.includes(expDef.returnType)
                    && excludedExpressions.indexOf(expDef.id) === -1
                ) {
                    currentGroup.slotTypes.push({
                        id: expDef.id,
                        label: expDef.label,
                        icon: expDef.icon,
                        color: expDef.color
                    })
                }
            })
        }

        if (currentGroup.slotTypes.length > 0) {
            groups.push(currentGroup)
        }
    })


    return <div >
        <SlotLabel label={props.slotDef.label} required={props.slotDef.required} />
        <SlotTypeSelector
            groups={groups}
            isRequired={props.slotDef.required}
            onSelect={props.onSelect}
        />
    </div>
}

export default EmptySlot;
