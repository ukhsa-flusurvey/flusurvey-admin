export enum EditorMode { Properties = 'properties', ItemEditor = 'itemEditor', Advanced = 'advanced', Simulator = 'simulator' }
// TODO: Add all relevant types or remove this enum
export enum ItemComponentRole {
    ResponseGroup = 'responseGroup',
    Options = 'options',
    Row = 'row',
    StartLabel = 'start',
    EndLabel = 'end',
    HeaderRow = 'headerRow',
    ResponseRow = 'responseRow',
    DropdownGroup = 'dropDownGroup',
    Text = 'text',
    Cloze = 'cloze',
    TimeInput = 'timeInput',
    DateInput = 'dateInput',
    ResponsiveBipolarLikertScaleArray = 'responsiveBipolarLikertScaleArray',
}
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
export enum ClozeItemType {
    SimpleText = 'text',
    Markdown = 'markdown',
    TextInput = 'input',
    LineBreak = 'lineBreak',
    NumberInput = 'numberInput',
    DateInput = 'dateInput',
    TimeInput = 'timeInput'
}
//  Currently unused, do we need this?
export enum ClozeItemGroupType {
    Text = 'text',
    Dropdown = 'dropDownGroup'
}
