import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import './ToolGeneralInfo.scss';
import { Row, Col, Image } from 'antd';
import { ImagePlaceholder } from '../../../assets/icons';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonToolGeneralInfoProps = {
    toolName: string;
    toolImage: string;
    toolUrl: string;
};
export type ToolGeneralInfoProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonToolGeneralInfoProps
> &
    CommonToolGeneralInfoProps;

export const ToolGeneralInfo: FC<ToolGeneralInfoProps> = ({
    className,
    toolName,
    toolImage,
    toolUrl,
    ...restProps
}) => {
    return (
        <div className={cn(className)}>
            <Row>
                <p className='tool-info-title'>General Information</p>
            </Row>
            <Row>
                <Col style={{ display: 'flex' }}>
                    <span>
                        <Image
                            className='tool-image'
                            width={114}
                            height={114}
                            src={ImagePlaceholder}
                            fallback={ImagePlaceholder}
                        />
                    </span>
                    <span>
                        <p
                            className='tool-info-desc'
                            style={{ marginTop: '50px' }}
                        >
                            Slack
                        </p>
                        <p className='tool-info-desc'>
                            http://toolup.slack.com
                        </p>
                    </span>
                </Col>
            </Row>
        </div>
    );
};
