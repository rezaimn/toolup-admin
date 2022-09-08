import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Col, Form, Input, Row } from 'antd';
import { Button } from '../../Atoms/Button';
import { yellowWarningIcon } from '../../../assets/icons';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonDeletePasswordConfirmModalProps = {
    onDeleteClick: () => void;
    onCancelClick: () => void;
};
export type DeletePasswordConfirmModalProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDeletePasswordConfirmModalProps
> &
    CommonDeletePasswordConfirmModalProps;

export const DeletePasswordConfirmModal: FC<DeletePasswordConfirmModalProps> = ({
    className,
    onDeleteClick,
    onCancelClick,
    ...restProps
}) => {
    return (
        <div className={cn(className)}>
            <p className='tool-info-title'>Delete Password</p>
            <Row className='pb-30'>
                <Col span={16} offset={4}>
                    <Row>
                        <Col span={24} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex' }}>
                                <img
                                    src={yellowWarningIcon}
                                    style={{ margin: '0px auto' }}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ marginBottom: '10px' }}>
                            <p
                                className='black-title'
                                style={{
                                    textAlign: 'center',
                                    margin: '20px 0',
                                }}
                            >
                                Are you sure you want to delete this password?
                            </p>
                        </Col>
                    </Row>
                    <Row justify='center'>
                        <Col span={11}>
                            <Button
                                type='default'
                                htmlType='submit'
                                style={{ float: 'right' }}
                                onClick={onCancelClick}
                            >
                                CANCEL
                            </Button>
                        </Col>
                        <Col span={11} offset={2}>
                            <Button
                                onClick={onDeleteClick}
                                type='primary'
                                htmlType='submit'
                            >
                                DELETE
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};
