export enum EditorMode { Properties = 'properties', ItemEditor = 'itemEditor', Advanced = 'advanced', Simulator = 'simulator' }
export enum ChoiceResponseOptionType {
    SimpleText = 'option',
    FormattedText = 'formattedOption',
    TextInput = 'input',
    NumberInput = 'numberInput',
    TimeInput = 'timeInput',
    DateInput = 'dateInput',
    Cloze = 'cloze',
    DisplayText = 'sectionHeader'
}
// TODO: Add all relevant types or remove this enum
export enum ItemComponentRole {
    ResponseGroup = 'responseGroup',
    Cloze = 'cloze',
    TimeInput = 'timeInput',
    DateInput = 'dateInput',
}
export enum ClozeItemType {
    SimpleText = 'text',
    Markdown = 'markdown',
    TextInput = 'input',
    LineBreak = 'lineBreak',
    NumberInput = 'numberInput',
    DateInput = 'dateInput',
    TimeInput = 'timeInput'
}
//  Currently unused
export enum ClozeItemGroupType {
    Text = 'text',
    Dropdown = 'dropDownGroup'
}
