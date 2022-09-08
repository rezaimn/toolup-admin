import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import map from 'lodash/map';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import FormStyle from './assets/styles/FormWrapper.style';

const HooKForm = ({
    inputs,
    submitButton,
    loadData,
    backendErrors,
    requestType,
    reValidateMode,
    defaultValues,
    disableEventListner,
    customSubmit,
    url,
    onSuccess,
    extraPart,
    changeData,
}) => {
    const [updatedValues, setUpdatedValues] = useState(defaultValues);

    useEffect(() => {
        setUpdatedValues(defaultValues);
    }, [defaultValues]);
    const {
        handleSubmit,
        errors,
        clearErrors,
        control,
        watch,
        formState: { touched },
        setError,
        setValue,
    } = useForm({
        mode: 'onSubmit',
        reValidateMode: reValidateMode || 'onChange',
        defaultValues: updatedValues,
    });

    useEffect(() => {
        if (document.getElementById('double-button-submit')) {
            window.addEventListener('keydown', doubleEventListner, false);
        } else if (document.getElementById('custom-submit') !== null) {
            window.addEventListener('keydown', customEventListner, false);
        }
    }, []);

    const doubleEventListner = e => {
        const isLoading = loadData.showLoader;
        if (
            !disableEventListner &&
            e.key === 'Enter' &&
            !isLoading &&
            e.target.localName !== 'textarea' &&
            document.getElementById('double-button-submit')
        ) {
            document.getElementById('double-button-submit').click();
        }
    };

    const customEventListner = e => {
        const isLoading = loadData.showLoader;
        if (
            !disableEventListner &&
            e.key === 'Enter' &&
            !isLoading &&
            e.target.localName !== 'textarea' &&
            document.getElementById('custom-submit')
        ) {
            document.getElementById('custom-submit').click();
        }
    };

    const isLoading =
        loadData.showLoader && loadData.requestType === requestType;

    const onSubmit = data => {
        let customData = data;
        if (changeData) {
            customData = changeData(data);
        }
        if (isEmpty(errors)) {
            customSubmit(customData, setError);
        }
    };

    return (
        <FormStyle>
            <form onSubmit={handleSubmit(onSubmit)}>
                {map(
                    inputs,
                    item =>
                        item && (
                            <Controller
                                control={control}
                                name={item.name}
                                defaultValue={item.defaultValue}
                                className='field-wrapper'
                                rules={item.validation}
                                render={(
                                    { onChange, value, name },
                                    { isDirty }
                                ) => (
                                    <div
                                        className={`field-wrapper ${item.dynamicClass}`}
                                    >
                                        <item.component.type
                                            name={name}
                                            value={value}
                                            setValue={setValue}
                                            onChange={onChange}
                                            label={item.label}
                                            className={
                                                backendErrors.includes(name) &&
                                                'has-error'
                                            }
                                            watch={watch}
                                            errors={errors}
                                            touched={touched}
                                            isDirty={isDirty}
                                            setError={setError}
                                            clearErrors={clearErrors}
                                            {...item}
                                            {...item.component.props}
                                        />
                                    </div>
                                )}
                            />
                        )
                )}
                {extraPart}
                {submitButton.double ? (
                    <div className='double-button'>
                        <Button
                            id='double-button-submit'
                            className='submit-button w-auto'
                            variant='contained'
                            size='small'
                            color={submitButton.submitColor}
                            textcolor={
                                submitButton.submitTextColor
                                    ? submitButton.submitTextColor
                                    : 'white'
                            }
                            onClick={handleSubmit(onSubmit)}
                            loading={isLoading}
                        >
                            {submitButton.submitText}
                        </Button>
                        <Button
                            size='small'
                            color='greyText'
                            textcolor={
                                submitButton.cancelTextColor
                                    ? submitButton.cancelTextColor
                                    : 'white'
                            }
                            onClick={() => submitButton.cancelFunction()}
                            className={`${submitButton.cancelbtnClass} cancel-button w-auto`}
                        >
                            {submitButton.cancelText}
                        </Button>
                    </div>
                ) : (
                    <Button
                        id='double-button-submit'
                        className='submit-button w-auto'
                        variant='contained'
                        size='small'
                        color={submitButton.submitColor}
                        textcolor={
                            submitButton.submitTextColor
                                ? submitButton.submitTextColor
                                : 'white'
                        }
                        onClick={handleSubmit(onSubmit)}
                        loading={isLoading}
                    >
                        {submitButton.submitText}
                    </Button>
                )}
            </form>
        </FormStyle>
    );
};

const mapStateToProps = state => ({
    loadData: get(state.LoadingReducer, 'loadData', {}),
    backendErrors: get(state.FormReducer, 'errors', []),
    backendErrorDetail: get(state.FormReducer, 'errorDetail', []),
});

HooKForm.propTypes = {
    inputs: PropTypes.array,
    submitButton: PropTypes.object,
    loadData: PropTypes.object,
    backendErrors: PropTypes.array,
    requestType: PropTypes.string,
    reValidateMode: PropTypes.string,
    url: PropTypes.string,
    defaultValues: PropTypes.object,
    disableEventListner: PropTypes.bool,
    onSuccess: PropTypes.func,
    extraPart: PropTypes.object,
    changeData: PropTypes.func,
};

export default connect(mapStateToProps)(HooKForm);
