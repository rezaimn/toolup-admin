import React, { useState } from 'react';
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import { upload } from '../../../assets/icons/index';
import { removeIcon } from '../../../assets/icons/index';

const styles = {
    dropzone: { height: 186, border: '1px dashed #D5D5D5' },
    inputLabel: { color: '#747474' },
};

const Preview = ({ meta, files }) => {
    const { name, percent, status } = meta;
    return (
        <span className='flex items-center flex-col justify-end text-xs mt-8'>
            <div className='text-center items-center flex-col'>
                <img className='w-34 mx-auto mb-8' src={upload} />
                <div className='text-lg font-sans'>
                    Drag & drop or{' '}
                    <span className='underline text-blue-700 italic'>
                        browse file
                    </span>
                </div>
            </div>
            <div className='mt-24 w-full flex justify-start'>{name}</div>
            <div className='w-full h-28 flex my-4'>
                <div className='flex-grow rounded-md bg-white'>
                    <div
                        className='w3-grey'
                        style={{
                            height: '100%',
                            width: `${percent}%`,
                            'border-radius': 5,
                            'background-image':
                                'linear-gradient(125deg, #235270 4.76%, #bfcdd6 4.76%, #bfcdd6 10%, #235270 10%, #235270 14.76%, #bfcdd6 14.76%, #bfcdd6 20%, #235270 20%, #235270 24.76%, #bfcdd6 24.76%, #bfcdd6 30%, #235270 30%, #235270 34.76%, #bfcdd6 34.76%, #bfcdd6 40%, #235270 40%, #235270 44.76%, #bfcdd6 44.76%, #bfcdd6 50%, #235270 50%, #235270 54.76%, #bfcdd6 54.76%, #bfcdd6 60%, #235270 60%, #235270 64.76%, #bfcdd6 64.76%, #bfcdd6 70%, #235270 70%, #235270 74.76%, #bfcdd6 74.76%, #bfcdd6 80%, #235270 80%, #235270 84.76%, #bfcdd6 84.76%, #bfcdd6 90%, #235270 90%, #235270 94.76%, #bfcdd6 94.76%, #bfcdd6 100%)',
                        }}
                    />
                </div>
                <img
                    className='flex-none m-2 ml-6'
                    src={removeIcon}
                    onClick={() => files.forEach(f => f.remove())}
                />
            </div>
            <div className='flex justify-between w-full'>
                <span>{status}</span>
                <span>{Math.round(percent)}%</span>
            </div>
        </span>
    );
};

const CustomInput = ({
    input,
    previews,
    submitButton,
    dropzoneProps,
    files,
}) => {
    return (
        <div className='bg-gray-100 w-3/4 border-dashed border-white rounded-xl flex flex-col max-w-2xl'>
            <div
                className='flex flex-col'
                style={{ dropzoneActive: { borderColor: 'white' } }}
                {...dropzoneProps}
            >
                {files.length === 0 && input}
                {previews}
            </div>
        </div>
    );
};

const Uploader = ({
    url,
    fileName,
    maxFiles,
    setFileUploadFinished,
    setPrevStep,
    setFileName,
}) => {
    const [file, setFile] = useState([]);
    const getUploadParams = () => {
        return {
            fields: { [fileName]: file },
            url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        };
    };

    const handleChangeStatus = ({ meta, file, xhr }, status) => {
        setFile(file);
        if (status === 'done' || status === 'headers_received') {
            let response = JSON.parse(xhr.response);
            setFileName(response.members_file);
            setFileUploadFinished(true);
            setPrevStep(2);
        }
    };

    return (
        <Dropzone
            LayoutComponent={props => <CustomInput {...props} />}
            PreviewComponent={props => <Preview {...props} />}
            ClassNames='bg-black'
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            accept='.csv,.xlsx,.xls,'
            styles={styles}
            maxFiles={maxFiles}
            multiple={false}
            canCancel={false}
            inputContent={
                <div className='text-center items-center flex-col'>
                    <img className='w-34 mx-auto mb-8' src={upload} />
                    <div className='text-lg font-bold font-sans'>
                        Drag & drop or{' '}
                        <span className='underline text-blue-700 italic'>
                            browse file
                        </span>
                    </div>
                    <div className='text-xs text-gray-400 mt-33 font-normal font-sans'>
                        Supports: excel file and CSV or json file
                    </div>
                </div>
            }
        />
    );
};

export default Uploader;
