import React from 'react';
import { ItemComponent } from 'survey-engine/data_types';

interface DateInputContentConfigProps {
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
}

const DateInputContentConfig: React.FC<DateInputContentConfigProps> = (props) => {
    return (
        <p>DateInputContent</p>
    );
};

export default DateInputContentConfig;
