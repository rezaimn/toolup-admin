import React, { Fragment, FC, useState } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Divider } from 'antd';
import { Button } from '../../Components/Atoms/Button';

import { ToolGeneralInfo } from '../../Components/Organisms/ToolGeneralInfo';
import './ToolPasswordSetup.scss';
import { EditPasswordCard } from '../../Components/Organisms/EditPasswordCard';
import { ReadyToSetPasswordCard } from '../../Components/Organisms/ReadyToSetPasswordCard';
import { NotActivatedPasswordCard } from '../../Components/Organisms/NotActivatedPasswordCard';
import { Modal } from '../../Components/Atoms/Modal';
import { EditPasswordModal } from '../../Components/Organisms/EditPasswordModal';
import { DeletePasswordConfirmModal } from '../../Components/Organisms/DeletePasswordConfirmModal';
import styles from '../Teams/styles.module.scss';
/* helpers */
/* assets */
/* styles */
/* types */
const ToolPasswordSetup: FC = () => {
    const [editModalShow, setEditModalShow] = useState(false);
    const [deletePasswordModalShow, setDeletePasswordModalShow] = useState(
        false
    );
    return (
        <>
            <Row className={styles.main} style={{ borderRadius: '10px' }}>
                <Col span={16} offset={4} style={{ padding: '40px 0' }}>
                    <ToolGeneralInfo toolName='' toolImage='' toolUrl='' />
                    <NotActivatedPasswordCard />

                    <Row style={{ marginTop: '40px' }}>
                        <Col span={6}>
                            <p
                                className='blue-title'
                                style={{ marginBottom: '0px' }}
                            >
                                Passwords
                            </p>
                        </Col>
                        <Col span={8} offset={10}>
                            <Button
                                type='primary'
                                icon={<PlusOutlined />}
                                style={{ float: 'right' }}
                            >
                                ADD NEW PASSWORD
                            </Button>
                        </Col>
                    </Row>
                    <Divider />
                    <EditPasswordCard
                        onEditClick={() => {
                            setEditModalShow(true);
                        }}
                        onDeleteClick={() => {
                            setDeletePasswordModalShow(true);
                        }}
                    />
                    <Divider />
                    <div>
                        <EditPasswordCard
                            className='blur'
                            onEditClick={() => {
                                setEditModalShow(true);
                            }}
                            onDeleteClick={() => {
                                setDeletePasswordModalShow(true);
                            }}
                        />
                        <ReadyToSetPasswordCard
                            setPasswordClicked={() => {
                                setEditModalShow(true);
                            }}
                        />
                    </div>
                </Col>
            </Row>

            <Modal
                visible={editModalShow}
                footer={null}
                width={800}
                onCancel={() => {
                    setEditModalShow(false);
                }}
            >
                <EditPasswordModal
                    onSaveClick={() => {
                        setEditModalShow(false);
                    }}
                    onCancelClick={() => {
                        setEditModalShow(false);
                    }}
                />
            </Modal>
            <Modal visible={deletePasswordModalShow} footer={null} width={800}>
                <DeletePasswordConfirmModal
                    onDeleteClick={() => {
                        setDeletePasswordModalShow(false);
                    }}
                    onCancelClick={() => {
                        setDeletePasswordModalShow(false);
                    }}
                />
            </Modal>
        </>
    );
};

export default ToolPasswordSetup;
