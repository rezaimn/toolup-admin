import React, { ComponentPropsWithoutRef, FC, useState } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Col, Row } from 'antd';
/* helpers */
/* assets */
/* styles */
/* types */
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { Button } from '../../Atoms/Button';
import './EditPasswordCard.scss';
import { EditPasswordCardItem } from '../../Molecules/EditPasswordCardItem';

export type CommonEditPasswordCardProps = {
    onEditClick: () => void;
    onDeleteClick: () => void;
};
export type EditPasswordCardProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonEditPasswordCardProps
> &
    CommonEditPasswordCardProps;

export const EditPasswordCard: FC<EditPasswordCardProps> = ({
    className,
    onEditClick,
    onDeleteClick,
    ...restProps
}) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div className={cn(className)}>
            <Row style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <p className='black-title'>Tool Name</p>
                </Col>
                <Col span={12}>
                    <Button
                        onClick={onEditClick}
                        type='primary'
                        style={{ float: 'right' }}
                    >
                        EDIT
                    </Button>
                    <Button
                        onClick={onDeleteClick}
                        type='default'
                        style={{ float: 'right', marginRight: '20px' }}
                    >
                        DELETE
                    </Button>
                </Col>
            </Row>
            <div className={collapsed ? 'collapsed' : 'not-collapsed'}>
                <Row>
                    <Col span={11}>
                        <EditPasswordCardItem />
                    </Col>
                    <Col span={11} offset={2}>
                        <EditPasswordCardItem />
                    </Col>
                    <Col span={11}>
                        <EditPasswordCardItem />
                    </Col>
                    <Col span={11} offset={2}>
                        <EditPasswordCardItem />
                    </Col>
                    <Col span={11}>
                        <EditPasswordCardItem />
                    </Col>
                    <Col span={11} offset={2}>
                        <EditPasswordCardItem />
                    </Col>
                </Row>
            </div>

            <div style={{ display: 'flex' }}>
                {collapsed ? (
                    <CaretUpFilled
                        className='collapse-arrows'
                        onClick={() => {
                            setCollapsed(false);
                        }}
                    />
                ) : (
                    <CaretDownFilled
                        className='collapse-arrows'
                        onClick={() => {
                            setCollapsed(true);
                        }}
                    />
                )}
            </div>
        </div>
    );
};
