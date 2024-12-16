import { ItemComponentRole } from "@/components/survey-editor/components/types";
import { ItemGroupComponent, SurveySingleItem } from "survey-engine/data_types";
import React from "react";
import ClozeContentConfig from "./cloze-content-config";

interface ClozeEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const ClozeEditor: React.FC<ClozeEditorProps> = (props) => {
    //const [draggedId, setDraggedId] = React.useState<string | null>(null);
    //console.log('props.surveyItem:', props.surveyItem);
    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const responseGroup = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!responseGroup || !responseGroup.items) {
        return <p>Response group not found</p>;
    }

    const clozeComponentIndex = responseGroup.items.findIndex(comp => comp.role === ItemComponentRole.Cloze);
    if (clozeComponentIndex === undefined || clozeComponentIndex === -1) {
        return <p>Cloze group not found</p>;
    }

    //const responseGroup = props.surveyItem.components?.items.find(item => item.role === ItemComponentRole.ResponseGroup) as ItemGroupComponent;

    /*     const updateSurveyItemWithNewItems = (newItems: ItemComponent[]) => {
            responseGroup.items = responseGroup.items.map(comp => comp.role === ItemComponentRole.Cloze ? { ...comp, items: newItems } : comp);
            const updatedItemGroupComponent = { ...props.surveyItem.components, items: props.surveyItem.components?.items.map(comp => comp.key === responseGroup.key ? responseGroup : comp) } as ItemGroupComponent;
            props.onUpdateSurveyItem({
                ...props.surveyItem,
                components: updatedItemGroupComponent,
            });
        } */

    const onChange = (newComp: ItemGroupComponent) => {
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[clozeComponentIndex] = newComp;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingComponents,
            }
        });
    }


    return (
        <ClozeContentConfig
            component={responseGroup.items[clozeComponentIndex] as ItemGroupComponent}
            onChange={onChange}
        />
    );
}

export default ClozeEditor;
