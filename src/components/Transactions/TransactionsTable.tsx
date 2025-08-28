import React, { useState } from 'react';

interface TransactionsTableProps {
    rows?: Array<{
        key: React.Key;
        date: string;
        location: string;
        rooms: string;
        sqm: number | string;
        price: string;
    }>;
    onLoadMore?: () => void;
}

// Моковые данные для демонстрации (расширенные для тестирования пагинации)
const mockTransactions = [
    {
        key: '1',
        date: '2024-08-21',
        location: 'Downtown Dubai',
        rooms: '2BR',
        sqm: '95',
        price: '1,850,000'
    },
    {
        key: '2',
        date: '2024-08-20',
        location: 'Dubai Marina',
        rooms: '1BR',
        sqm: '75',
        price: '1,200,000'
    },
    {
        key: '3',
        date: '2024-08-19',
        location: 'Business Bay',
        rooms: '3BR',
        sqm: '120',
        price: '2,500,000'
    },
    {
        key: '4',
        date: '2024-08-18',
        location: 'DIFC',
        rooms: '2BR',
        sqm: '85',
        price: '2,100,000'
    },
    {
        key: '5',
        date: '2024-08-17',
        location: 'JBR',
        rooms: '1BR',
        sqm: '65',
        price: '1,400,000'
    },
    {
        key: '6',
        date: '2024-08-16',
        location: 'Palm Jumeirah',
        rooms: '4BR',
        sqm: '180',
        price: '4,200,000'
    },
    {
        key: '7',
        date: '2024-08-15',
        location: 'Dubai Hills',
        rooms: '3BR',
        sqm: '140',
        price: '2,800,000'
    },
    {
        key: '8',
        date: '2024-08-14',
        location: 'City Walk',
        rooms: '2BR',
        sqm: '110',
        price: '2,300,000'
    },
    {
        key: '9',
        date: '2024-08-13',
        location: 'Dubai Creek',
        rooms: '1BR',
        sqm: '70',
        price: '1,100,000'
    },
    {
        key: '10',
        date: '2024-08-12',
        location: 'Jumeirah Village',
        rooms: '2BR',
        sqm: '90',
        price: '1,600,000'
    },
    {
        key: '11',
        date: '2024-08-11',
        location: 'Dubai South',
        rooms: '3BR',
        sqm: '130',
        price: '1,900,000'
    },
    {
        key: '12',
        date: '2024-08-10',
        location: 'Al Barsha',
        rooms: '2BR',
        sqm: '100',
        price: '1,750,000'
    }
];

const TransactionsTable: React.FC<TransactionsTableProps> = ({ rows = mockTransactions, onLoadMore }) => {
    const [displayCount, setDisplayCount] = useState(5);
    const [loading, setLoading] = useState(false);
    
    const handleShowMore = async () => {
        setLoading(true);
        console.log('🔄 Loading more transactions...');
        
        // Симуляция загрузки
        setTimeout(() => {
            setDisplayCount(prev => prev + 5);
            setLoading(false);
            console.log('✅ Loaded more transactions');
            
            // Вызываем callback если есть
            if (onLoadMore) {
                onLoadMore();
            }
        }, 500);
    };
    
    const displayedRows = rows.slice(0, displayCount);
    const hasMore = displayCount < rows.length;

    return (
        <div className="space-y-3">
            <table className="w-full">
                <thead>
                    <tr className="text-left text-sm text-[#6b7280]">
                        <th className="py-2">Date</th>
                        <th className="py-2">Location</th>
                        <th className="py-2">Rooms</th>
                        <th className="py-2">M²</th>
                        <th className="py-2">Price, AED</th>
                        <th className="py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {displayedRows.map((r) => (
                        <tr key={r.key} className="border-t">
                            <td className="py-3">{r.date}</td>
                            <td className="py-3">{r.location}</td>
                            <td className="py-3">{r.rooms}</td>
                            <td className="py-3">{r.sqm}</td>
                            <td className="py-3 font-medium">{r.price}</td>
                            <td className="py-3 text-right">
                                <button 
                                    className="px-3 py-1 border rounded-md hover:bg-gray-50 transition-colors"
                                    onClick={() => console.log('Details clicked for:', r.key)}
                                >
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Show more button with loading state */}
            {hasMore && (
                <div className="text-center">
                    <button 
                        className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleShowMore}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                Loading...
                            </span>
                        ) : (
                            `Show more (${rows.length - displayCount} remaining)`
                        )}
                    </button>
                </div>
            )}
            
            {/* Show count info */}
            <div className="text-center text-sm text-gray-500">
                Showing {displayedRows.length} of {rows.length} transactions
            </div>
        </div>
    );
};

export default TransactionsTable;


