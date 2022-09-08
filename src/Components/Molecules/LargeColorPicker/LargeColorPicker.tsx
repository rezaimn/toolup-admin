import { ComponentPropsWithoutRef, FC, useEffect, useState } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { head, isEqual, map, pipe } from 'lodash/fp';
/* helpers */
/* assets */
/* constants */
import COLORS from 'Constants/colors';
/* styles */
import styles from './styles.module.scss';

/* types */
export type CommonLargeColorPickerProps = {
    title?: string;
    onChange: (color: string) => void;
};
export type LargeColorPickerProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonLargeColorPickerProps
> &
    CommonLargeColorPickerProps;

export const LargeColorPicker: FC<LargeColorPickerProps> = ({
    className,
    title = '',
    onChange,
    onBlur,
    ...restProps
}) => {
    const [selectedColor, setSelectedColor] = useState(head(COLORS) as string);

    useEffect(() => {
        onChange(selectedColor);
    }, [selectedColor]);

    return (
        <div className={cn(className, styles.colorPicker)} onBlur={onBlur}>
            {renderTitle(title)}
            <ColorsList
                colors={COLORS}
                onColorChange={setSelectedColor}
                selectedColor={selectedColor}
            />
        </div>
    );

    function renderTitle(t: string): JSX.Element | undefined {
        if (t) {
            return <p className={styles.title}>{title}</p>;
        }
        return undefined;
    }
};

export type CommonColorsListProps = {
    colors: string[];
    selectedColor: string;
    onColorChange: (color: string) => void;
};

export type ColorsListProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonColorsListProps
> &
    CommonColorsListProps;

export const ColorsList: FC<ColorsListProps> = ({
    className,
    colors,
    selectedColor,
    onColorChange,
}) => {
    /* iterate over colors and render a beautiful color component */
    const mappedOver = map<string, JSX.Element>(c => (
        <div className={styles.colorItem}>
            <Color
                onColorChange={onColorChange}
                selectedColor={selectedColor}
                color={c}
            />
        </div>
    ))(colors);

    return <div className={cn(className, styles.list)}>{mappedOver}</div>;
};

export type ColorProps = {
    color: string;
    selectedColor: string;
    onColorChange: (color: string) => void;
} & ComponentPropsWithoutRef<'div'>;

export const Color: FC<ColorProps> = ({
    color: background,
    selectedColor,
    onColorChange,
}) => {
    const isActive = isEqual(background)(selectedColor);

    const handleColorClick = (color: string) => () => onColorChange(color);
    return (
        <div
            onClick={handleColorClick(background)}
            style={{ background }}
            className={cn(styles.color, { [styles.active]: isActive })}
            aria-hidden='true'
        />
    );
};
