import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Col, Row } from 'antd';
import {
    copyTextIcon,
    exportIcon,
    grayEyeIcon,
    plusWhite,
} from '../../../assets/icons';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonEditPasswordCardItemProps = {};
export type EditPasswordCardItemProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonEditPasswordCardItemProps
> &
    CommonEditPasswordCardItemProps;

export const EditPasswordCardItem: FC<EditPasswordCardItemProps> = ({
    className,
    ...restProps
}) => {
    return (
        <div className={cn(className)}>
            <Row>
                <Col span={24}>
                    <p className='blue-text'>Label</p>
                </Col>
                <Col span={16}>
                    <p className='black-text'>some text</p>
                </Col>
                <Col span={7} offset={1}>
                    <div style={{ display: 'flex', float: 'right' }}>
                        <span>
                            <img
                                src={exportIcon}
                                alt=''
                                style={{
                                    cursor: 'pointer',
                                    float: 'right',
                                    marginRight: '14px',
                                    height: '14px',
                                }}
                            />
                        </span>
                        <span>
                            <img
                                src={grayEyeIcon}
                                alt=''
                                style={{
                                    cursor: 'pointer',
                                    marginRight: '14px',
                                    height: '14px',
                                }}
                            />
                        </span>
                        <span>
                            <img
                                src={copyTextIcon}
                                alt=''
                                style={{
                                    cursor: 'pointer',
                                    height: '15px',
                                }}
                            />
                        </span>
                    </div>
                </Col>
            </Row>
        </div>
    );
};
