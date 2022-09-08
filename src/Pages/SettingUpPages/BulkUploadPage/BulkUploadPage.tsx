import React, { useState } from 'react';
import { csv } from '../../../assets/files';
import { xlsx } from '../../../assets/files';
import SelectBox from '../../../Components/Molecules/SelectBox/SelectBox';
import Uploader from '../../../Components/Molecules/Uploader/Uploader';
import BASE_URL from 'Constants/baseUrl';
import { CSVOff, XLSOff, CSVOn, XLSOn } from '../../../assets/icons/index';

interface Props {
    setFileUploadFinished: any;
    setPrevStep: any;
    setFileName: any;
}

const BulkUploadPage: React.FC<Props> = ({
    setFileUploadFinished = () => {},
    setPrevStep = () => {},
    setFileName = () => {},
}) => {
    const [option, setOption] = useState('');
    const [hover, setHover] = useState('');
    const url = `${BASE_URL}/members/bulk/upload`;

    return (
        <>
            <div className='flex h-full justify-center items-center flex-col'>
                <div className='flex justify-center items-center w-full'>
                    <Uploader
                        setFileName={setFileName}
                        setFileUploadFinished={setFileUploadFinished}
                        setPrevStep={setPrevStep}
                        url={url}
                        fileName='members_file'
                        maxFiles={1}
                    />
                </div>
                <div className='text-center justify-center mt-30 text-gray-500'>
                    Do you want an excel or CVS sample?
                </div>
                <div className='flex justify-center items-center flex-wrap'>
                    <a href={xlsx} download>
                        <SelectBox
                            text='Excel file sample'
                            icon={
                                option === 'excel' || hover === 'excel'
                                    ? XLSOn
                                    : XLSOff
                            }
                            selected={option === 'excel'}
                            hovered={hover === 'excel'}
                            onClick={() => setOption('')}
                            onMouseEnter={() => setHover('excel')}
                            onMouseLeave={() => setHover('')}
                            customClass='h-80 w-200 text-xs'
                            imgClass='w-21'
                        />
                    </a>
                    <a href={csv} download>
                        <SelectBox
                            text='CSV sample'
                            icon={
                                option === 'csv' || hover === 'csv'
                                    ? CSVOn
                                    : CSVOff
                            }
                            onClick={() => setOption('')}
                            selected={option === 'csv'}
                            hovered={hover === 'csv'}
                            onMouseEnter={() => setHover('csv')}
                            onMouseLeave={() => setHover('')}
                            customClass='h-80 w-200 text-xs'
                            imgClass='w-21'
                        />
                    </a>
                </div>
            </div>
        </>
    );
};

export default BulkUploadPage;
