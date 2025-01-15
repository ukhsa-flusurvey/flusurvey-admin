import React, { useState, useEffect } from 'react';
import { ResponseItem, ItemGroupComponent } from 'survey-engine/data_types';
import { getLocaleStringTextByCode, getItemComponentByRole, CommonResponseComponentProps } from '../../utils';
import DropDownGroup from './DropDownGroup';
import TextViewComponent from '../../SurveyComponents/TextViewComponent';
import TextInput from './TextInput';
import NumberInput from './NumberInput';
import Time from './Time';
import DateInput from '../DateInput/DateInput';


type MatrixProps = CommonResponseComponentProps


const Matrix: React.FC<MatrixProps> = (props) => {
    const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (touched) {
            const timer = setTimeout(() => {
                props.responseChanged(response);
            }, 200);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    /*const radioSelectionChanged = (rowKey: string | undefined) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!rowKey) { return; }
        const selectedValue = event.target.value;

        setTouched(true);
        setResponse(prev => {
            if (!prev || !prev.items) {
                return {
                    key: props.compDef.key ? props.compDef.key : 'no key found',
                    items: [{
                        key: rowKey, items: [{ key: selectedValue }]
                    }]
                }
            }

            const rowIndex = prev.items.findIndex(item => item.key === rowKey);
            const items = [...prev.items];
            if (rowIndex > -1) {
                items[rowIndex].items = [{ key: selectedValue }];
            } else {
                items.push({
                    key: rowKey, items: [{ key: selectedValue }]
                });
            }

            return {
                ...prev,
                items: items
            }
        });
    }*/

    /*const checkboxSelectionChanged = (rowKey: string | undefined) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!rowKey) { return; }
        setTouched(true);
        const selectedValue = event.target.value;
        const checked = event.target.checked;
        if (checked) {
            const newRI: ResponseItem = {
                key: selectedValue,
            }
            setResponse(prev => {
                if (!prev || !prev.items) {
                    return {
                        key: props.compDef.key ? props.compDef.key : 'no key found',
                        items: [{
                            key: rowKey, items: [newRI]
                        }]
                    }
                }
                const rowIndex = prev.items.findIndex(item => item.key === rowKey);
                const items = [...prev.items];
                if (rowIndex > -1) {
                    const currentItems = items[rowIndex];
                    items[rowIndex].items = currentItems.items ? [...currentItems.items, newRI] : [newRI];
                } else {
                    items.push({
                        key: rowKey, items: [newRI]
                    });
                }
                return {
                    ...prev,
                    items: items
                }

            });
        } else {
            setResponse(prev => {
                if (!prev || !prev.items) {
                    return {
                        key: props.compDef.key ? props.compDef.key : 'no key found',
                        items: []
                    }
                }
                const rowIndex = prev.items.findIndex(item => item.key === rowKey);
                const items = [...prev.items];
                if (rowIndex > -1) {
                    const currentItems = items[rowIndex];
                    items[rowIndex].items = currentItems.items?.filter(i => i.key !== selectedValue);
                }
                return {
                    ...prev,
                    items: items,
                }

            });
        }

    }*/

    const handleCellResponseChange = (rowKey: string | undefined, itemKey: string | undefined) => (response: ResponseItem | undefined) => {
        if (!rowKey || !itemKey) { return; }
        setTouched(true);

        setResponse(prev => {
            if (!prev || !prev.items) {
                return {
                    key: props.compDef.key ? props.compDef.key : 'no key found',
                    items: [{
                        key: rowKey, items: response ? [response] : []
                    }]
                }
            }

            const rowIndex = prev.items.findIndex(item => item.key === rowKey);
            const items = [...prev.items];
            if (rowIndex > -1) {
                const currentItems = items[rowIndex].items;
                if (!currentItems) {
                    console.warn('row doesnt have items');
                    return prev;
                }
                const itemIndex = currentItems.findIndex(it => it.key === itemKey);
                if (itemIndex > -1) {
                    if (!response) {
                        currentItems.splice(itemIndex, 1);
                    } else {
                        currentItems[itemIndex] = response;
                    }
                } else if (response) {
                    currentItems.push(response);
                }
                items[rowIndex].items = [...currentItems];
            } else {
                items.push({
                    key: rowKey, items: response ? [response] : []
                });
            }

            return {
                ...prev,
                items: items
            }
        });
    }

    const getCellResponse = (rowKey: string | undefined, itemKey: string | undefined): ResponseItem | undefined => {
        if (!rowKey || !itemKey) { return undefined; }

        if (!response || !response.items || response.items.length < 1) {
            return undefined;
        }
        const rowResponse = response.items.find(item => item.key === rowKey);
        if (!rowResponse || !rowResponse.items || rowResponse.items.length < 1) { return undefined; }
        const resp = rowResponse.items.find(item => item.key === itemKey);
        return resp;
    }

    /*const isResponseSet = (rowKey: string | undefined, itemKey: string | undefined): boolean => {
        if (!getCellResponse(rowKey, itemKey)) {
            return false;
        }
        return true;
    }*/

    /*
    const renderRadioRow = (compDef: ItemGroupComponent, index: number): React.ReactNode => {
        const rowKey = [props.parentKey, compDef.key].join('.');

        const cells = (compDef as ItemGroupComponent).items.map((cell, cindex) => {
            let currentCellContent: React.ReactNode | null;
            const cellKey = [rowKey, cell.key].join('.');
            switch (cell.role) {
                case 'label':
                    currentCellContent = getLocaleStringTextByCode(cell.content, props.languageCode);
                    if (cindex === 0) {
                        return <th
                            key={cell.key ? cell.key : cindex.toString()}
                            className={clsx(
                                "border-bottom border-grey-2",
                                "px-2 py-1",
                            )}
                        >{currentCellContent}</th>
                    }
                    break;
                case 'option':
                    currentCellContent = <input
                        className="form-check-input cursor-pointer"
                        type="radio"
                        id={cellKey}
                        value={cell.key}
                        aria-label={cell.key}
                        checked={isResponseSet(compDef.key, cell.key)}
                        onChange={radioSelectionChanged(compDef.key)}
                        disabled={compDef.disabled !== undefined || cell.disabled !== undefined}
                    />
                    <Radio
                        checked={isResponseSet(compDef.key, cell.key)}
                        onChange={radioSelectionChanged(compDef.key)}
                        value={cell.key}
                        disabled={compDef.disabled !== undefined || cell.disabled !== undefined}
                        inputProps={{ 'aria-label': cell.key }}
                      />;
                    break;
                default:
                    console.warn('cell role for matrix question unknown: ', cell.role);
                    break;
            }
            return <td
                key={cell.key ? cell.key : cindex.toString()}
                className={clsx(
                    "border-bottom border-grey-2",
                    "px-2 py-1",
                    {
                        'text-center': cell.role === 'option',
                    })}
                style={{
                    minWidth: 33,
                }}
            >{currentCellContent}</td>
        }

        );
        return <tr key={compDef.key}
        >
            {cells}
        </tr>
    }
    */


    const matrixDef = (props.compDef as ItemGroupComponent);
    const headerRow = getItemComponentByRole(matrixDef.items, 'headerRow');

    const renderResponseRow = (compDef: ItemGroupComponent): React.ReactNode => {
        const rowLabel = getLocaleStringTextByCode(compDef.content, props.languageCode) || '';
        const rowKey = [props.parentKey, compDef.key].join('.');

        return <div
            key={rowKey}
            role="row"
            className="flex flex-col md:flex-row  border-b border-[--survey-card-table-border-color] last:border-b-0">
            <div role='rowheader'
                className="font-bold flex-1 px-[--survey-card-px-sm] sm:px-[--survey-card-px] py-1.5 md:hidden">
                {rowLabel}
            </div>


            <div className='flex flex-col sm:flex-row grow px-[--survey-card-px-sm] sm:px-[--survey-card-px] -mx-2 md:items-center'>
                <div role="rowheader" className="hidden md:flex font-bold flex-1 min-w-0 px-2 py-1.5">
                    {rowLabel}
                </div>
                {compDef.items.map((cell, cindex) => {
                    const cellKey = [rowKey, cell.key].join('.');
                    const headerLabel = (headerRow) && getLocaleStringTextByCode((headerRow as ItemGroupComponent).items.at(cindex)?.content, props.languageCode) || '';

                    let inputSlot = <p>No input slot found</p>;
                    switch (cell.role) {
                        case 'dropDownGroup':
                            inputSlot = <DropDownGroup
                                compDef={cell}
                                embedded={true}
                                languageCode={props.languageCode}
                                responseChanged={handleCellResponseChange(compDef.key, cell.key)}
                                prefill={getCellResponse(compDef.key, cell.key)}
                                fullWidth={true}
                                parentKey={cellKey}
                                dateLocales={props.dateLocales}
                            />
                            break;
                        case 'text':
                            inputSlot = <TextViewComponent
                                key={cell.key}
                                compDef={cell}
                                languageCode={props.languageCode}
                                embedded={true}
                                className='text-center'
                            />;
                            break;
                        case 'input':
                            inputSlot = <TextInput
                                parentKey={props.parentKey}
                                key={cell.key}
                                compDef={cell}
                                embedded={true}
                                languageCode={props.languageCode}
                                responseChanged={handleCellResponseChange(compDef.key, cell.key)}
                                prefill={getCellResponse(compDef.key, cell.key)}
                                updateDelay={5}
                                dateLocales={props.dateLocales}
                            />;
                            break;
                        case 'numberInput':
                            inputSlot = <NumberInput
                                parentKey={props.parentKey}
                                key={cell.key}
                                compDef={cell}
                                embedded={true}
                                languageCode={props.languageCode}
                                responseChanged={handleCellResponseChange(compDef.key, cell.key)}
                                prefill={getCellResponse(compDef.key, cell.key)}
                                dateLocales={props.dateLocales}
                            />;
                            break;
                        case 'timeInput':
                            inputSlot = <Time
                                parentKey={props.parentKey}
                                defaultClassName='justify-center'
                                key={cell.key}
                                compDef={cell}
                                embedded={true}
                                languageCode={props.languageCode}
                                responseChanged={handleCellResponseChange(compDef.key, cell.key)}
                                prefill={getCellResponse(compDef.key, cell.key)}
                                dateLocales={props.dateLocales}
                            />
                            break;
                        case 'dateInput':
                            inputSlot = <DateInput
                                parentKey={props.parentKey}
                                key={cell.key}
                                compDef={cell}
                                embedded={true}
                                languageCode={props.languageCode}
                                responseChanged={handleCellResponseChange(compDef.key, cell.key)}
                                prefill={getCellResponse(compDef.key, cell.key)}
                                openCalendar={false}
                                dateLocales={props.dateLocales}
                            />;
                            break;
                        default:
                            inputSlot = <p>Unknown role: {cell.role}</p>;
                            break;
                    }



                    return <div key={cellKey}
                        role="cell" className="flex-1 px-2 py-0.5">
                        <div className='block md:hidden text-sm font-semibold mb-1' role="columnheader">
                            {headerLabel}
                        </div>
                        <div className='my-2'>
                            {inputSlot}
                        </div>
                    </div>
                })}
            </div>
        </div>

        //
        // const cells = (compDef as ItemGroupComponent).items.map((cell, cIndex) => {
        //
        //     let currentCellContent: React.ReactNode | null;
        //     const isLast = index === matrixDef.items.length - 1;
        //     switch (cell.role) {
        //         case 'label':
        //             currentCellContent = getLocaleStringTextByCode(cell.content, props.languageCode);
        //             if (cIndex === 0) {
        //                 return <th
        //                     key={cell.key ? cell.key : cIndex.toString()}
        //                     className={clsx(
        //                         "px-2 py-1",
        //                         {
        //                             "border-b border-gray-200": !isLast

        //                         })}
        //                 >{currentCellContent}</th>
        //             }
        //             break;
        //         case 'check':
        //             currentCellContent = <input
        //                 className="form-checkbox text-primary-600 w-5 h-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
        //                 type="checkbox"
        //                 id={cellKey}
        //                 value={cell.key}
        //                 aria-label={cell.key}
        //                 checked={isResponseSet(compDef.key, cell.key)}
        //                 onChange={checkboxSelectionChanged(compDef.key)}
        //                 disabled={compDef.disabled !== undefined || cell.disabled !== undefined}
        //             />
        //             /*
        //             <Checkbox
        //               checked={isResponseSet(compDef.key, cell.key)}
        //               value={cell.key}
        //               onChange={checkboxSelectionChanged(compDef.key)}
        //               inputProps={{ 'aria-label': cell.key }}
        //               disabled={compDef.disabled !== undefined || cell.disabled !== undefined}
        //             />;*/
        //             break
        //         case 'input':
        //             currentCellContent = <div
        //                 className="w-full"
        //                 style={{
        //                     minWidth: 120,
        //                 }}
        //             >
        //                 <TextInput
        //                     parentKey={cellKey}
        //                     compDef={cell}
        //                     languageCode={props.languageCode}
        //                     responseChanged={handleCellResponseChange(compDef.key, cell.key)}
        //                     prefill={getCellResponse(compDef.key, cell.key)}
        //                     dateLocales={props.dateLocales}
        //                 />
        //             </div>
        //             break
        //         case 'numberInput':
        //             currentCellContent =
        //                 <NumberInput
        //                     parentKey={cellKey}
        //                     embedded={true}
        //                     compDef={cell}
        //                     languageCode={props.languageCode}
        //                     responseChanged={handleCellResponseChange(compDef.key, cell.key)}
        //                     prefill={getCellResponse(compDef.key, cell.key)}
        //                     dateLocales={props.dateLocales}
        //                 />
        //             break
        //         case 'dropDownGroup':
        //             currentCellContent = <DropDownGroup
        //                 compDef={cell}
        //                 languageCode={props.languageCode}
        //                 responseChanged={handleCellResponseChange(compDef.key, cell.key)}
        //                 prefill={getCellResponse(compDef.key, cell.key)}
        //                 fullWidth={true}
        //                 parentKey={cellKey}
        //                 dateLocales={props.dateLocales}
        //             />
        //             break;
        //         default:
        //             console.warn('cell role for matrix question unknown: ', cell.role);
        //             break;
        //     }
        //     return <td
        //         key={cell.key ? cell.key : cIndex.toString()}
        //         className={clsx(
        //             "px-2 py-1",
        //             {
        //                 "border-b border-gray-200": !isLast

        //             })}
        //     >{currentCellContent}</td>
        // }

        // );
        // return <tr key={compDef.key}
        // >
        //     {cells}
        // </tr>
    }

    const renderTableRow = (compDef: ItemGroupComponent): React.ReactNode => {
        if (compDef.displayCondition === false) {
            return null;
        }
        switch (compDef.role) {
            /*case 'radioRow':
                return renderRadioRow(compDef, index);
                */
            case 'responseRow':
                return renderResponseRow(compDef);
            case 'headerRow':
                // header is already rendered separately
                return null;
            default:
                console.warn('row role for matrix question unknown: ', compDef.role);
                return null;
        }
    }

    const renderHeaderRow = (header: ItemGroupComponent | undefined): React.ReactNode => {
        if (!header) {
            return null;
        }

        const cells = header.items.map((cell, index) => {
            let currentCellContent: React.ReactNode | null;
            switch (cell.role) {
                case 'text':
                    currentCellContent = getLocaleStringTextByCode(cell.content, props.languageCode);
                    break;
                default:
                    console.warn('cell role for matrix header unknown: ', cell.role);
                    break;
            }
            return <div
                key={cell.key ? cell.key : index.toString()}
                role="columnheader" className="font-bold flex-1 truncate px-2 py-1.5 text-center"
            >
                {currentCellContent}
            </div>
        });

        return <div role="rowgroup" className="hidden md:flex border-b border-[--survey-card-table-border-color] w-full">
            <div role="row" className='flex flex-col sm:flex-row w-full px-[--survey-card-px-sm] sm:px-[--survey-card-px] grow -mx-2'>
                <div role="columnheader" className="font-bold flex-1 px-2 py-1.5"></div>
                {cells}
            </div>

        </div>
    }


    return (
        <div role="table" className="flex flex-col">
            {/* Table Header for large screens */}
            {renderHeaderRow(headerRow as ItemGroupComponent)}
            {/* Rows */}
            {matrixDef.items.map((row) => renderTableRow(row as ItemGroupComponent))}
        </div >)
};

export default Matrix;
