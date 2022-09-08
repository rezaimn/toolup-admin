import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup/FormGroup';
import FormControl from '@material-ui/core/FormControl/FormControl';

const CustomInput = ({
    WrapperProps,
    onChange,
    label,
    link,
    value,
    errors,
    name,
    inputId,
}) => (
    <div {...WrapperProps} className='checkbox-input'>
        <FormControl component='fieldset' error={!!errors[name]}>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            id={inputId}
                            checked={value}
                            onChange={event => onChange(event.target.checked)}
                            name={label}
                            color='primary'
                        />
                    }
                    label={
                        <span>
                            Accept{' '}
                            <a href={link} target='_blank'>
                                {label}
                            </a>
                        </span>
                    }
                />
                {!!errors[name] && (
                    <FormHelperText>{errors[name].message}</FormHelperText>
                )}
            </FormGroup>
        </FormControl>
    </div>
);
CustomInput.propTypes = {
    WrapperProps: PropTypes.object,
    errors: PropTypes.object,
    onChange: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.bool,
};

export default CustomInput;
