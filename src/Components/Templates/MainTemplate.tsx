import React, { ReactElement } from 'react';

interface Props {
    sidebar: ReactElement;
    content: ReactElement;
}

const MainTemplate: React.FC<Props> = ({ sidebar = null, content = null }) => {
    return (
        <>
            <div>
                <div className='grid grid-rows-12 grid-flow-col gap-4'>
                    <div className={'px-4 py-10'}>
                        <div className='col-span-3 h-screen'>{sidebar}</div>
                    </div>
                    <div className='col-span-9 h-screen '>
                        <div className={'px-10 py-10'}>{content}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MainTemplate;
