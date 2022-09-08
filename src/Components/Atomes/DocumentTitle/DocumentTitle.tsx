import { FC } from 'react';
/* components */
import { Helmet } from 'react-helmet';
/* modules */
/* helpers */
/* assets */
/* styles */
/* types */
import { HelmetProps } from 'react-helmet';
export type CommonDocumentTitleProps = {};
export type DocumentTitleProps = HelmetProps & CommonDocumentTitleProps;

export const DocumentTitle: FC<DocumentTitleProps> = props => {
    return <Helmet {...props} />;
};
