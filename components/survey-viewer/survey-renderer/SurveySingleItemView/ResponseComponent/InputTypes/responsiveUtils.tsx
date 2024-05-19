import React from "react";
import { getClassName } from "../../utils";
import { cn } from "@/lib/utils";

const bootstrapBreakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'];

interface BreakpointModeDef {
    start?: string;
    end?: string;
    variant: Variant;
}

export type Variant = BipolarLikertScaleVariant | SingleChoiceVariant;

type SingleChoiceVariant = 'vertical' | 'horizontal' | 'table';
type BipolarLikertScaleVariant = 'vertical' | 'withLabelRow' | 'table';

const getModeForBreakpont = (bp: string, styles?: Array<{ key: string, value: string }>): Variant | undefined => {
    if (!styles) { return undefined };
    const bpMode = styles.find(style => style.key === `${bp}Mode`);
    if (!bpMode) {
        return undefined;
    }
    return bpMode.value as Variant;
}

const getDefaultMode = (styles?: Array<{ key: string, value: string }>): Variant | undefined => {
    if (!styles) { return undefined };
    const bpMode = styles.find(style => style.key === 'defaultMode');
    if (!bpMode) {
        return 'vertical';
    }
    return bpMode.value as Variant;
}

export const getResponsiveModes = (width: number, renderMode: (variant: Variant, namePrefix: string) => React.ReactNode, styles?: Array<{ key: string, value: string }>) => {
    const defaultMode = getDefaultMode(styles);
    if (!defaultMode) {
        return <p>No default mode found.</p>
    }
    let currentMode: BreakpointModeDef = {
        variant: defaultMode
    };

    const screenSize = getScreenSizeLabel(width);
    const screenSizeIndex = bootstrapBreakpoints.indexOf(screenSize);

    bootstrapBreakpoints.forEach((bp, index) => {
        if (index >= screenSizeIndex) {
            return
        }
        const mode = getModeForBreakpont(bp, styles);
        if (mode === undefined) {
            return;
        }
        currentMode.end = bp;
        currentMode = {
            start: bp,
            variant: mode,
        }
    });


    const className = getClassName(styles);

    return (
        <React.Fragment>
            <div
                className={cn(
                    'overflow-visible',
                    className,
                )}
            >
                {renderMode(currentMode.variant, currentMode.start ? currentMode.start : 'default')}
            </div>
        </React.Fragment>
    )
}


const getScreenSizeLabel = (width: number): string => {
    if (width < 649) {
        return 'xs';
    }
    if (width < 768) {
        return 'sm';
    }
    if (width < 1024) {
        return 'md';
    }
    if (width < 1280) {
        return 'lg';
    }
    return 'xl';
}
