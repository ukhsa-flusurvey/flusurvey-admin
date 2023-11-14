import { Expression as CaseExpression, ExpressionArg as CaseExpressionArg } from 'survey-engine/data_types';

export interface Expression {
    name: string;
    returnType?: string;
    data?: Array<undefined | ExpressionArg>;
    metadata?: {
        slotTypes: Array<string | undefined>;
    }
}

export interface ExpressionArg extends CaseExpressionArg {

}


type ExpressionTypes = 'action' | 'num' | 'str' | 'boolean';


interface SlotTypeBase {
    id: string;
}

interface SimpleSlotType extends SlotTypeBase {
    type: 'num' | 'str' | 'date' | 'time-delta';
};


export interface SelectSlotType extends SlotTypeBase {
    type: 'select',
    options: {
        key: string;
        label: string;
    }[]
}

interface FormSlotType extends SlotTypeBase {
    type: 'key-value' | 'list-selector'
}

interface ExpressionSlotType extends SlotTypeBase {
    type: 'expression',
    allowedExpressionTypes?: Array<ExpressionTypes>;
    excludedExpressions?: Array<string>;
}


export type AllowedSlotType = SimpleSlotType | ExpressionSlotType | SelectSlotType | FormSlotType;


export interface SlotDef {
    label: string;
    required: boolean;
    argIndexes?: number[]; // to override how the order of the arguments is mapped to slots
    isListSlot?: boolean;
    allowedTypes?: AllowedSlotType[];
}



export type ColorVariant = 'blue' | 'green' | 'yellow' | 'purple' | 'teal' | 'cyan' | 'dark' | 'lime' | 'orange';
export type IconVariant = 'braces' | 'function' | 'code' | 'box' | 'variable' | 'brackets' | 'regex' | 'square-code' | 'terminal' | 'signpost' | 'layout-list' |
    'tag' | 'calendar' | 'text-cursor' | 'form-input' | 'parentheses' | 'pyramid' | 'triangle' | 'square' | 'diamond' | 'database' | 'split' | 'circle-slash' | 'blocks';


interface SlotInputDefBase {
    id: string;
    type: string;
    categories: string[];
    label: string;
    color?: ColorVariant;
    icon?: IconVariant;
}

interface SlotInputDefSimple extends SlotInputDefBase {
    type: 'num' | 'str' | 'date' | 'time-delta';
}

interface SlotInputDefFormKeyValueFromContext extends SlotInputDefBase {
    type: 'key-value';
    contextObjectKey: string,
    filterForItemType?: string,
    filterForValueType?: string,
}

export interface SlotInputDefSelectorFromContext extends SlotInputDefBase {
    type: 'list-selector'
    contextArrayKey: string,
    filterForItemType?: string, // array items only if they have this type
}

export type SlotInputDef = SlotInputDefSimple | SlotInputDefFormKeyValueFromContext | SlotInputDefSelectorFromContext;


export interface ExpressionDef {
    id: string;
    categories: string[];
    label: string;
    slots: SlotDef[];
    returnType: ExpressionTypes;
    color?: ColorVariant;
    icon?: IconVariant;
    // expression return type: action, num, str, boolean
}


export interface ExpressionCategory {
    id: string;
    label: string;
}


export const lookupExpressionDef = (name: string, registry: ExpressionDef[]): ExpressionDef | undefined => {
    return registry.find(def => def.id === name);
}


interface ContextObjectItem {
    [key: string]: {
        value: string;
        type?: string;
    }
}

export interface ContextArrayItem {
    key: string;
    label: string;
    type?: string; // can be used to make items filterable
}

export interface ExpEditorContext {
    [key: string]: ContextObjectItem | ContextArrayItem[];
}



