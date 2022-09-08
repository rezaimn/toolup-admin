import React, { useState, useEffect } from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default function CheckboxesGroup({
    value = [],
    items,
    onChange,
    label,
    max,
    errors,
    name,
    initailValue,
    setValue,
    inputId,
}) {
    const [selected, setSelected] = useState(value);

    const handleCheckBoxChange = (selectedOption, checked) => {
        let selectedValues = [...selected];
        if (checked) {
            selectedValues.push(selectedOption.value);
            selectedValues = _.uniq(selectedValues);
        } else {
            selectedValues = selectedValues.filter(
                item => selectedOption.value !== item
            );
        }
        if (max) {
            selectedValues.splice(0, selectedValues.length - max);
        }
        setSelected(selectedValues);
        onChange(selectedValues);
    };

    useEffect(() => {
        setValue(name, initailValue, { shouldDirty: true });
    }, [initailValue]);

    return (
        <div className='checkbox-group-wrapper'>
            <FormControl component='fieldset' error={!!errors[name]}>
                <FormLabel component='legend'>{label}</FormLabel>
                <FormGroup>
                    {_.map(items, item => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={inputId}
                                    checked={value.includes(item.value)}
                                    onChange={event =>
                                        handleCheckBoxChange(
                                            item,
                                            event.target.checked
                                        )
                                    }
                                    name={item.label}
                                    color='primary'
                                />
                            }
                            label={item.label}
                        />
                    ))}
                </FormGroup>
                {!!errors[name] && (
                    <FormHelperText>{errors[name].message}</FormHelperText>
                )}
            </FormControl>
        </div>
    );
}

CheckboxesGroup.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
    label: PropTypes.string,
    items: PropTypes.array,
    max: PropTypes.string,
    name: PropTypes.string,
    errors: PropTypes.object,
};
