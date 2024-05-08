import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { ResponseItem, ItemGroupComponent } from 'survey-engine/data_types';
import { CommonResponseComponentProps, getLocaleStringTextByCode } from '../../utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface DropDownGroupProps extends CommonResponseComponentProps {
    fullWidth?: boolean;
    defaultClassName?: string;
}


const DropDownGroup: React.FC<DropDownGroupProps> = (props) => {
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

    const getSelectedKey = (): string | undefined => {
        if (!response || !response.items || response.items.length < 1) {
            return '';
        }
        return response.items[0].key;
    }

    const handleSelectionChange = (value: string) => {
        setTouched(true);
        const key = value;
        setResponse(prev => {
            if (!key || key === '') {
                return undefined;
            }
            if (!prev) {
                return {
                    key: props.compDef.key ? props.compDef.key : 'no key found',
                    items: [{ key: key }]
                }
            }
            return {
                ...prev,
                items: [
                    { key }
                ]
            }
        });
    };

    const renderedInput = <Select


        value={getSelectedKey()}
        onValueChange={handleSelectionChange}

    >
        <SelectTrigger
            id={props.parentKey}
        >
            <SelectValue
                placeholder={getLocaleStringTextByCode(props.compDef.description, props.languageCode)} />
        </SelectTrigger>
        <SelectContent>
            {
                (props.compDef as ItemGroupComponent).items.map(
                    item => {
                        if (item.displayCondition) {
                            return null;
                        }
                        return <SelectItem
                            key={item.key}
                            value={item.key || ''}>
                            {getLocaleStringTextByCode(item.content, props.languageCode)}
                        </SelectItem>
                    }
                )
            }
        </SelectContent>
    </Select>;

    return (
        <div className={clsx(
            props.defaultClassName,
            "flex items-center my-2")}>
            {props.compDef.content ?
                <Label
                    htmlFor={props.parentKey}
                    className="m-0 me-2 shrink" style={{ minWidth: 80 }}>
                    {getLocaleStringTextByCode(props.compDef.content, props.languageCode)}
                </Label>
                : null}
            {renderedInput}
        </div>
    );
};

export default DropDownGroup;
