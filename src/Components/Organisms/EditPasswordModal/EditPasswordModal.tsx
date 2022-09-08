import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Row, Col, Form, Input } from 'antd';
import { Button } from '../../Atoms/Button';
import { PlusOutlined } from '@ant-design/icons';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonEditPasswordModalProps = {
    onSaveClick: () => void;
    onCancelClick: () => void;
};
export type EditPasswordModalProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonEditPasswordModalProps
> &
    CommonEditPasswordModalProps;

export const EditPasswordModal: FC<EditPasswordModalProps> = ({
    className,
    onSaveClick,
    onCancelClick,
    ...restProps
}) => {
    const [form] = Form.useForm();
    return (
        <div className={cn(className)}>
            <Row>
                <Col span={22} offset={1}>
                    <Form
                        layout='vertical'
                        form={form}
                        name='register'
                        scrollToFirstError
                    >
                        <Row justify='start'>
                            <Col span={11}>
                                <Form.Item
                                    name='title'
                                    label='Title'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter Title!',
                                        },
                                    ]}
                                >
                                    <Input placeholder='Title' />
                                </Form.Item>
                            </Col>
                            <Col span={11} offset={2}>
                                <Form.Item wrapperCol={{ span: 24 }}>
                                    <Button
                                        type='primary'
                                        icon={<PlusOutlined />}
                                        style={{
                                            float: 'right',
                                            marginTop: '30px',
                                        }}
                                    >
                                        ADD NEW FIELD
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item
                                    name='title'
                                    label='Title'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter Title!',
                                        },
                                    ]}
                                >
                                    <Input placeholder='Title' />
                                </Form.Item>
                            </Col>
                            <Col span={11} offset={2}>
                                <Form.Item
                                    name='title'
                                    label='Title'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter Title!',
                                        },
                                    ]}
                                >
                                    <Input placeholder='Title' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify='center'>
                            <Col span={11}>
                                <Form.Item wrapperCol={{ span: 24 }}>
                                    <Button
                                        onClick={onCancelClick}
                                        type='default'
                                        htmlType='submit'
                                        style={{ float: 'right' }}
                                    >
                                        CANCEL
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={11} offset={2}>
                                <Form.Item wrapperCol={{ span: 24 }}>
                                    <Button
                                        onClick={onSaveClick}
                                        type='primary'
                                        htmlType='submit'
                                    >
                                        SAVE
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};
