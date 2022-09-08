import React, { ComponentPropsWithoutRef, forwardRef, useState, useRef, useImperativeHandle, useEffect } from "react";
/* components */
import { toast } from 'Components/Atomes/ToastContainer';
/* modules */
import { Form } from "Components/Atoms/Form";
import { Button } from "Components/Atoms/Button";
import { Input } from "Components/Atoms/Input";
import { Select } from "Components/Atoms/Select";
import { useMailServices, useMailServiceUpdate, mailServiceData } from 'Hooks/api';
import { Steps } from 'Components/Organisms/SetupProcessBanner';
import { toString } from 'lodash/fp';
/* helpers */
/* assets */
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { customMail } from 'assets/icons';
/* styles */
import styles from './styles.module.scss';
import { isEmpty, map } from "lodash";
import { routeTo } from "Helpers/routeTo";
import { useHistory } from "react-router-dom";
import { Delete } from "@icon-park/react";
/* types */
export type CommonMailServiceFormProps = {
    mailServiceSelected: (state: boolean) => void;
}
export type MailServiceFormProps = Omit<ComponentPropsWithoutRef<'form'>,
    keyof CommonMailServiceFormProps
> &
    CommonMailServiceFormProps;
export type MailServiceFormRef = React.HtmlHTMLAttributes<HTMLFormElement>;

export const MailServiceForm = forwardRef<MailServiceFormRef, MailServiceFormProps>(({ className, mailServiceSelected }, ref) => {
    const {
        data: mailServices,
    } = useMailServices();
    const formRef = useRef<MailServiceFormRef>(null!);
    const { mutate: updateMailService } = useMailServiceUpdate();
    const history = useHistory();
    const imperativeHandle = () => {
        return {
            onSubmit: () => {
                form.submit()
            },
        } as MailServiceFormRef;
    };

    useImperativeHandle(ref, () => imperativeHandle());

    const [form] = Form.useForm();

    const [custom, setCustom] = useState(false);

    const onChange = () => {
        if (form.getFieldValue('tool_id') && !isEmpty(form.getFieldValue('url'))) {
            mailServiceSelected(true);
        }
    };

    const onFinish = (data: { domain: [], url: string, tool_id: any }) => {
        if (custom) {
            updateMailService(
                {
                    config: {
                        domain: data?.domain
                    },
                    url: data.url,
                },
                {
                    onSuccess: () => {
                        history.push(routeTo('intro', { step: Steps.second }));
                    },
                    onError: error => {
                        toast('error', toString(error));
                    },
                }
            );
        } else {
            updateMailService(
                {
                    config: {
                        domain: data?.domain
                    },
                    url: data.url,
                    tool_id: data.tool_id
                },
                {
                    onSuccess: () => {
                        history.push(routeTo('intro', { step: Steps.second }));
                    },
                    onError: error => {
                        toast('error', toString(error));
                    },
                }
            );
        }
    }
    return <div className={styles.wrapper}>
        <h2 className={styles.title}>
            Select your email service
        </h2>
        <Form ref={formRef as any}
            form={form} name="mail_service" className={styles.form} onFinish={onFinish}>
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: "Required",
                    },
                ]}
                className={styles.selectInput}
                name="tool_id"
            >
                <Select
                    placeholder="Select your email service"
                    size="large"
                    optionFilterProp="children"
                    onChange={(value) => {
                        if (value === 'custom') {
                            setCustom(true);
                            onChange();
                        } else {
                            setCustom(false);
                            onChange();
                        }
                    }}
                >
                    <Select.Option value="custom"><div className={styles.option}>
                        <img src={customMail} className={styles.image} />
                            Custom
                        </div></Select.Option>
                    {
                        map(mailServices, item => {
                            return <Select.Option value={item.id}><div className={styles.option}>
                                <img src={item.icon} className={styles.image} />
                                {item.name}
                            </div></Select.Option>
                        })
                    }
                </Select>
            </Form.Item>
            <label className={styles.inputLabel}>Login URL</label>
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: "Required",
                    },
                ]}
                className={styles.input}
                name="url"
            >
                <Input onChange={onChange} />
            </Form.Item>
            <Form.List
                name="domain"
            >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        <div className={styles.domainWrapper}>
                            <div className={styles.domainLabel}>
                                Email domains
                            </div>
                            <Form.Item>
                                <Button
                                    className={styles.addButton}
                                    onClick={() => add()}
                                    icon={<PlusOutlined />}
                                >
                                    ADD NEW DOMAIN
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </div>
                        {fields.map((field, index) => (
                            <div className={styles.input}
                            >
                                <label className={styles.inputLabel}>Domain - {index + 1}</label>
                                <div className={styles.inputWrapper}>
                                    <Form.Item
                                        {...field}
                                        name={field?.name}
                                        required={false}
                                        key={field.key}
                                        className={styles.input}
                                    >

                                        <Input />

                                    </Form.Item>
                                    {fields.length > 1 ? (
                                        <Delete className={styles.removeButton} theme="outline" size="20" fill="#D5D5D5" onClick={() => remove(field.name)} />
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </Form.List>
        </Form>
    </div>
})