import { FC } from 'react';
/* components */
import { Typography, Steps, AutoComplete } from 'antd';
import { Checkbox } from 'Components/Atoms/Checkbox';
import { Select } from 'Components/Atoms/Select';
import { Dropdown } from 'Components/Atoms/Dropdown';
import { Menu } from 'Components/Atoms/Menu';
import { Button } from 'Components/Atoms/Button';
import { Input } from 'Components/Atoms/Input';
import { Switch } from 'Components/Atoms/Switch';
import { Modal } from 'Components/Atoms/Modal';
import { Badge } from 'Components/Atoms/Badge';
import { ArrowDown } from '@icon-park/react';

/* modules */
/* helpers */
/* assets */
/* styles */
/* types */
const { Step } = Steps;

const UiSheet: FC = () => {
    /*  useEffect(() => {
        notification.info({
            message: 'Salam',
            description: 'khobi?',
            placement: 'bottomLeft',
            icon: <Icon type='Info' theme='filled' fill='#01395e' />,
            duration: 100000,
        });
    }, []); */

    return (
        <div className='p-20 flex space-x-10 items-center flex-wrap'>
            <Button type='primary'>Salam</Button>
            <Button type='default'>Salam</Button>
            <Button type='primary' danger>
                Salam
            </Button>
            <Typography.Text type='warning'>Salam</Typography.Text>

            <Dropdown overlay={menu}>
                <ArrowDown />
            </Dropdown>

            <Select defaultValue='lucy' style={{ width: 120 }}>
                <Select.Option value='jack'>Jack</Select.Option>
                <Select.Option value='lucy'>Lucy</Select.Option>
                <Select.Option value='disabled' disabled>
                    Disabled
                </Select.Option>
                <Select.Option value='Yiminghe'>yiminghe</Select.Option>
            </Select>
            <Input style={{ width: '100px' }} allowClear />

            <Switch />

            <Input slot='Salam' style={{ width: 120 }} />
            <AutoComplete style={{ width: 120 }} />
        </div>
    );
};

const Title = () => (
    <Badge status='error'>
        <div>APP</div>
    </Badge>
);

export default UiSheet;

const menu = (
    <Menu style={{ width: '150px' }}>
        <Menu.Item className='flex space-x-10'>
            <Checkbox id='checkbox'>
                <Typography.Text>Finance</Typography.Text>
            </Checkbox>
        </Menu.Item>
        <Menu.Item className='flex space-x-10'>
            <Checkbox id='checkbox'>Finance</Checkbox>
        </Menu.Item>
        <Menu.Item className='flex space-x-10'>
            <Checkbox id='checkbox'>Finance</Checkbox>
        </Menu.Item>
        <Menu.Item className='flex space-x-10'>
            <Checkbox id='checkbox'>Finance</Checkbox>
        </Menu.Item>
        <Menu.Item className='flex space-x-10'>
            <Checkbox id='checkbox'>Finance</Checkbox>
        </Menu.Item>
        <Menu.Item className='flex space-x-10'>
            <Checkbox id='checkbox'>Finance</Checkbox>
        </Menu.Item>
    </Menu>
);
