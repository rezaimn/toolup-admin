import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Row, Col } from 'antd';
import { Button } from '../../Atoms/Button';
import './ReadyToSetPassword.scss';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonReadyToSetPasswordCardProps = {
    setPasswordClicked: () => void;
};
export type ReadyToSetPasswordCardProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonReadyToSetPasswordCardProps
> &
    CommonReadyToSetPasswordCardProps;

export const ReadyToSetPasswordCard: FC<ReadyToSetPasswordCardProps> = ({
    className,
    setPasswordClicked,
    ...restProps
}) => {
    return (
        <div className={cn(`${className} base-ready-to-setup`)}>
            <Row>
                <Col span={24} style={{ marginBottom: '10px' }}>
                    <p className='black-title' style={{ textAlign: 'center' }}>
                        Slack 2
                    </p>
                </Col>
                <Col span={24} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex' }}>
                        <Button
                            onClick={setPasswordClicked}
                            type='primary'
                            style={{ margin: '0px auto' }}
                        >
                            SET PASSWORD
                        </Button>
                    </div>
                </Col>
                <Col span={24}>
                    <p
                        className='gray-small-text'
                        style={{ textAlign: 'center' }}
                    >
                        You can set a password for this tool (company or
                        personal tools)
                    </p>
                </Col>
            </Row>
        </div>
    );
};
