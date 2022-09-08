import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Col, Row } from 'antd';
import { Button } from '../../Atoms/Button';
import {
    blueExportIcon,
    notActivatedPasswordIcon,
} from '../../../assets/icons';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonNotActivatedPasswordCardProps = {};
export type NotActivatedPasswordCardProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonNotActivatedPasswordCardProps
> &
    CommonNotActivatedPasswordCardProps;

export const NotActivatedPasswordCard: FC<NotActivatedPasswordCardProps> = ({
    className,
    ...restProps
}) => {
    return (
        <div className={cn(className)}>
            <Row style={{ marginTop: '100px' }}>
                <Col span={24} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex' }}>
                        <img
                            src={notActivatedPasswordIcon}
                            style={{
                                margin: '0px auto',
                                height: '130px',
                                width: '130px',
                            }}
                        />
                    </div>
                </Col>
                <Col span={12} offset={6} style={{ marginBottom: '20px' }}>
                    <p className='gray-title' style={{ textAlign: 'center' }}>
                        You have not yet activated this service or the company
                        has not purchased this service
                    </p>
                </Col>

                <Col span={8} offset={8}>
                    <span style={{ width: '100%', display: 'flex' }}>
                        <p
                            className='blue-small-text-underline'
                            style={{
                                textAlign: 'center',
                                marginRight: '14px',
                                width: '100%',
                            }}
                        >
                            Go to your profile page to activate
                        </p>
                        <img
                            src={blueExportIcon}
                            alt=''
                            style={{ position: 'relative', right: '14px' }}
                        />
                    </span>
                </Col>
            </Row>
        </div>
    );
};
