import React, { useState, useEffect, useCallback } from 'react';
import { ItemComponent, ResponseItem, ItemGroupComponent, isItemGroupComponent } from 'survey-engine/data_types';
import { CommonResponseComponentProps, getLocaleStringTextByCode } from '../../utils';
import TextInput from './TextInput';
import clsx from 'clsx';
import TextViewComponent from '../../SurveyComponents/TextViewComponent';
import NumberInput from './NumberInput';
import { renderFormattedContent } from '../../renderUtils';
import ClozeQuestion from './ClozeQuestion';
import Time from './Time';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';


interface MultipleChoiceGroupProps extends CommonResponseComponentProps {
    showOptionKey?: boolean;
}

const MultipleChoiceGroup: React.FC<MultipleChoiceGroupProps> = (props) => {
    const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
    const [touched, setTouched] = useState(false);

    const [subResponseCache, setSubResponseCache] = useState<Array<ResponseItem>>(
        (props.prefill && props.prefill.items) ? [...props.prefill.items] : []
    );

    useEffect(() => {
        if (touched) {
            const timer = setTimeout(() => {
                props.responseChanged(response);
            }, 200);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);


    const setResponseForKey = useCallback((key: string, checked: boolean, value?: string, dtype?: string, items?: ResponseItem[]) => {
        setTouched(true);
        if (checked) {
            const newRI: ResponseItem = {
                key: key,
            }
            if (value) {
                newRI.value = value;
            }
            if (dtype) {
                newRI.dtype = dtype;
            }
            if (items) {
                newRI.items = items;
            }
            setResponse(prev => {
                if (!prev || !prev.items) {
                    return {
                        key: props.compDef.key ? props.compDef.key : 'no key found',
                        items: [newRI]
                    }
                }
                const ind = prev.items.findIndex(pr => pr.key === key);
                if (ind < 0) {
                    prev.items.push(newRI);
                }
                else {
                    prev.items[ind] = newRI;
                }
                return {
                    ...prev,
                    items: [...prev.items]
                }
            });
        } else {
            setResponse(prev => {
                if (!prev) {
                    return undefined;
                }
                const newItems = prev.items?.filter(i => i.key !== key);
                if (!newItems || newItems.length < 1) {
                    return undefined;
                }
                return {
                    ...prev,
                    items: newItems,
                }
            });
        }
    }, [
        props.compDef.key,
    ])

    const handleSelectionChange = useCallback((key: string, checked: boolean) => {
        const subResp = subResponseCache.find(sr => sr.key === key);
        if (subResp) {
            setResponseForKey(key, checked, subResp.value, subResp.dtype, subResp.items);
        } else {
            setResponseForKey(key, checked);
        }
    }, [
        subResponseCache,
        setResponseForKey,
    ]);

    const updateSubResponseCache = (key: string | undefined, response: ResponseItem | undefined) => {
        // console.log('updateSubResponseCache', key, response)
        if (!response) {
            setSubResponseCache(prev => {
                const ind = prev.findIndex(pr => pr.key === key);
                if (ind < 0) {
                    return prev;
                }
                prev.splice(ind, 1);
                return [...prev];
            })
        } else {
            setSubResponseCache(prev => {
                const ind = prev.findIndex(pr => pr.key === key);
                if (ind < 0) {
                    prev.push(response);
                }
                else {
                    prev[ind] = { ...response };
                }
                return [...prev];
            })
        }
    }

    const isChecked = (key: string): boolean => {
        if (!response || !response.items || response.items.length < 1) {
            return false;
        }
        return response.items.findIndex(ri => ri.key === key) > -1;
    }

    const isDisabled = (item: ItemComponent): boolean => {
        if (item.disabled === true) {
            const key = item.key ? item.key : 'no key found';
            if (isChecked(key)) {
                setResponse(prev => {
                    if (!prev) { return { key: 'no key found', items: [] } }
                    return {
                        ...prev,
                        items: prev.items?.filter(i => i.key !== key),
                    }
                });
            }
            return true;
        }
        return false;
    }

    const renderResponseOption = (option: ItemComponent, isLast: boolean): React.ReactNode => {
        if (option.displayCondition === false) {
            return null;
        }
        const optionKey = props.parentKey + '.' + option.key;
        let labelComponent = <p>{'loading...'}</p>;
        const prefill = subResponseCache.find(r => r.key === option.key);

        let arialLabel = getLocaleStringTextByCode(option.content, props.languageCode) || option.key;
        if (isItemGroupComponent(option)) {
            switch (option.role) {
                case 'option':
                    labelComponent = <div
                        className={clsx("grow")}
                    >
                        {renderFormattedContent(option, props.languageCode, undefined, props.dateLocales)}
                    </div>
                    break;
                case 'cloze':
                    labelComponent = <ClozeQuestion
                        parentKey={optionKey}
                        key={option.key}
                        compDef={option}
                        prefill={(prefill && prefill.key === option.key) ? prefill : undefined}
                        languageCode={props.languageCode}
                        responseChanged={(response) => {
                            const checkStatus = (response !== undefined && response.items !== undefined);
                            setResponseForKey(option.key ? option.key : 'unknown', checkStatus, response?.value, undefined, response?.items);
                            updateSubResponseCache(option.key, response);
                        }}
                        disabled={isDisabled(option)}
                        dateLocales={props.dateLocales}
                    />;
                    break;
            }
        } else {
            switch (option.role) {
                case 'text':
                    return <TextViewComponent
                        key={option.key}
                        compDef={option}
                        languageCode={props.languageCode}
                    />;
                case 'option':
                    labelComponent = <span
                        className={clsx("w-full",
                        )}
                    >
                        {getLocaleStringTextByCode(option.content, props.languageCode)}
                    </span>;
                    break;
                case 'input':
                    labelComponent =
                        <TextInput
                            parentKey={props.parentKey}
                            key={option.key}
                            compDef={option}
                            prefill={(prefill && prefill.key === option.key) ? prefill : undefined}
                            languageCode={props.languageCode}
                            responseChanged={(response) => {
                                const value = response?.value;
                                const checkStatus = (value !== undefined && value.length > 0);
                                setResponseForKey(option.key ? option.key : 'unknown', checkStatus, value);
                                updateSubResponseCache(option.key, response);
                            }}
                            updateDelay={5}
                            disabled={isDisabled(option)}
                            dateLocales={props.dateLocales}
                        />;
                    break;
                case 'timeInput':
                    labelComponent =
                        <Time
                            parentKey={props.parentKey}
                            key={option.key}
                            compDef={option}
                            prefill={(prefill && prefill.key === option.key) ? prefill : undefined}
                            languageCode={props.languageCode}
                            responseChanged={(response) => {
                                const value = response?.value;
                                const checkStatus = (value !== undefined && value.length > 0);
                                setResponseForKey(option.key ? option.key : 'unknown', checkStatus, value, response?.dtype);
                                updateSubResponseCache(option.key, response);
                            }}
                            disabled={isDisabled(option)}
                            dateLocales={props.dateLocales}
                        />;
                    break;
                case 'numberInput':
                    labelComponent =
                        <NumberInput
                            parentKey={props.parentKey}
                            key={option.key}
                            compDef={option}
                            embedded={true}
                            prefill={(prefill && prefill.key === option.key) ? prefill : undefined}
                            languageCode={props.languageCode}
                            responseChanged={(response) => {
                                const value = response?.value;
                                const checkStatus = (value !== undefined && value.length > 0);
                                setResponseForKey(option.key ? option.key : 'unknown', checkStatus, value, response?.dtype);
                                updateSubResponseCache(option.key, response);
                            }}
                            disabled={isDisabled(option)}
                            dateLocales={props.dateLocales}
                        />;
                    break;
                default:
                    labelComponent = <p key={option.key}>role inside multiple choice group not implemented yet: {option.role}</p>
                    break;
            }
        }

        return (<Label
            htmlFor={optionKey + '_checkbox'}
            className={clsx(
                "flex items-center font-normal gap-2 sm:gap-3 text-base",
                'px-[--survey-card-px-sm] sm:px-[--survey-card-px] py-1.5',
                'hover:bg-black/5',
                {
                    'cursor-not-allowed opacity-50': isDisabled(option),
                    'cursor-pointer': !isDisabled(option),
                }
            )}
            key={option.key} >

            {props.showOptionKey ?
                <span className="text-primary me-2 text-xs">{option.key}</span>
                : null}
            <Checkbox
                className='bg-background size-5'
                aria-label={arialLabel}
                name={props.parentKey}
                id={optionKey + '_checkbox'}
                value={option.key}
                checked={isChecked(option.key ? option.key : 'no key found')}
                disabled={isDisabled(option)}
                onCheckedChange={(checked) => {
                    handleSelectionChange(option.key ? option.key : 'no key found', checked === true)
                }}
            />
            {labelComponent}
        </Label>)

    }

    if (!(props.compDef as ItemGroupComponent).items) {
        return <p>ERROR: multiple choice options missing</p>
    }

    return (
        <div
            id={props.parentKey}
            aria-label="multiple choice options"
            className='flex flex-col'
        >
            {
                (props.compDef as ItemGroupComponent).items.map((option, index) =>
                    renderResponseOption(option, (props.compDef as ItemGroupComponent).items.length - 1 === index)
                )
            }
        </div>
    );
};

export default MultipleChoiceGroup;
