import React, { useEffect, useState } from 'react';
import SelectBox from '../../../Components/Molecules/SelectBox/SelectBox';
import {
    importSelected,
    importIcon,
    manuallySelected,
    manually,
} from '../../../assets/icons/index';
import { setMembers } from '../../../Store/member/MemberAction';
import { useDispatch } from 'react-redux';
interface Props {
    setCurrentStep: any;
    setPrevStep: any;
}

const ImportTeamMethodPage: React.FC<Props> = ({
    setCurrentStep,
    setPrevStep,
}) => {
    const dispatch = useDispatch();
    const [option, setOption] = useState('');
    const [hover, setHover] = useState('');
    useEffect(() => {
        setCurrentStep(option === 'import' ? 2 : option === 'manually' ? 3 : 1);
        setPrevStep(1);
    });

    return (
        <>
            <div className='flex w-full justify-center items-center flex-col mt-50'>
                <div className='flex justify-center items-center flex-wrap'>
                    <SelectBox
                        text='Add Manually'
                        icon={
                            option === 'manually' || hover === 'manually'
                                ? manuallySelected
                                : manually
                        }
                        selected={option === 'manually'}
                        hovered={hover === 'manually'}
                        onClick={() => setOption('manually')}
                        onMouseEnter={() => setHover('manually')}
                        onMouseLeave={() => setHover('')}
                        customClass='xl:h-180 xl:w-260'
                        imgClass='w-32 lg:w-64'
                    />
                    <SelectBox
                        text='Import CSV/Excel or Json file'
                        icon={
                            option === 'import' || hover === 'import'
                                ? importSelected
                                : importIcon
                        }
                        onClick={() => setOption('import')}
                        selected={option === 'import'}
                        hovered={hover === 'import'}
                        onMouseEnter={() => setHover('import')}
                        onMouseLeave={() => setHover('')}
                        customClass='xl:h-180 xl:w-260'
                        imgClass='w-32 lg:w-64 text-xs lg:text-lg'
                    />
                </div>
                <div className='text-center justify-center mt-40 text-gray-500'>
                    Here you can choose how to import your team members
                </div>
            </div>
        </>
    );
};

export default ImportTeamMethodPage;
