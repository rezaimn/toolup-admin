import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const CustomInput = ({
    WrapperProps,
    onChange,
    label,
    errors,
    name,
    type,
    adornment,
    equalValidation,
    setError,
    clearErrors,
    watch,
    value,
    isDirty,
    setValue,
    initailValue,
    inputId,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const RenderAdornment = () =>
        adornment === 'password' ? (
            <IconButton
                aria-label='toggle password visibility'
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
        ) : (
            adornment
        );
    let RenderType = '';
    if (type === 'password') {
        RenderType = showPassword ? 'text' : 'password';
    } else {
        RenderType = type;
    }

    useEffect(() => {
        if (equalValidation) {
            if (equalValidation.field) {
                if (value !== watch(equalValidation.field) && isDirty) {
                    setError(name, {
                        type: 'manual',
                        message: equalValidation.message,
                    });
                } else {
                    clearErrors(name);
                }
            }
        }
    }, [value, equalValidation && watch(equalValidation.field)]);

    useEffect(() => {
        if (equalValidation) {
            if (errors[name] && errors[name].type === 'required' && value) {
                clearErrors(name);
            }
            if (
                errors[name] &&
                errors[name].type === 'minLength' &&
                value.length > 7
            ) {
                clearErrors(name);
            }
            if (
                errors[name] &&
                errors[name].type === 'pattern' &&
                equalValidation.patternValidation &&
                equalValidation.patternValidation.test(value)
            ) {
                clearErrors(name);
            }
        }
    }, [value]);

    useEffect(() => {
        setValue(name, initailValue, { shouldDirty: true });
    }, [initailValue]);

    return (
        <div {...WrapperProps} className='text-input'>
            <TextField
                id='standard-secondary'
                size='small'
                label={label}
                value={value}
                touched
                type={RenderType}
                onChange={onChange}
                error={!!errors[name]}
                helperText={!!errors[name] && errors[name].message}
                InputProps={{
                    id: inputId,
                    endAdornment: adornment && (
                        <InputAdornment position='end'>
                            <RenderAdornment />
                        </InputAdornment>
                    ),
                }}
            >
            <label for="my-input">Email address</label>
  <input id="my-input" aria-describedby="my-helper-text" />
            </TextField>
        </div>
    );
};

CustomInput.propTypes = {
    WrapperProps: PropTypes.object,
    onChange: PropTypes.func,
    label: PropTypes.string,
    errors: PropTypes.object,
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    adornment: PropTypes.string,
    endAdornment: PropTypes.bool,
    equalValidation: PropTypes.object,
    setError: PropTypes.func,
    clearErrors: PropTypes.func,
    watch: PropTypes.func,
    isDirty: PropTypes.bool,
};

export default CustomInput;
