import React, { Fragment, FC, useState } from "react";
/* components */
import { MailServiceForm } from 'Components/Organisms/MailServiceForm';
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
/* styles */
/* types */
interface Props {
    formRef: any;
    mailServiceSelected: (state: boolean) => void;
}

const SelectMailService: React.FC<Props> = ({ formRef, mailServiceSelected }) => {
    return (
        <>
            <MailServiceForm ref={formRef} mailServiceSelected={mailServiceSelected} />
        </>
    );
};

export default SelectMailService;