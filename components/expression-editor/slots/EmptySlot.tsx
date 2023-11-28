import SlotLabel from "../components/SlotLabel";
import SlotTypeSelector from "../components/SlotTypeSelector";
import { ExpressionCategory, ExpressionDef, SlotDef, SlotInputDef, getRecommendedSlotTypes } from "../utils";

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
    const groups = getRecommendedSlotTypes(props.slotDef, props.expRegistry);


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
