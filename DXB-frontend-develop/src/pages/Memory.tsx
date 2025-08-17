import React from 'react';
import { ProLayout } from '@ant-design/pro-components';
import MemoryDashboard from '@/components/MemoryDashboard';

const Memory: React.FC = () => {
    const handleMemorySelect = (memory: any) => {
        console.log('Selected memory:', memory);
        // Здесь можно добавить логику для работы с выбранным воспоминанием
    };

    return (
        <ProLayout
            title="Dubai Real Estate Memory LLM"
            logo="🧠"
            menuItemRender={(item, dom) => (
                <div style={{ color: '#1890ff' }}>{dom}</div>
            )}
        >
            <MemoryDashboard 
                onMemorySelect={handleMemorySelect}
                showActions={true}
            />
        </ProLayout>
    );
};

export default Memory;
