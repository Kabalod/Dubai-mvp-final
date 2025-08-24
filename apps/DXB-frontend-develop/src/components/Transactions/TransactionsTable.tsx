import React from 'react';

interface TransactionsTableProps {
    rows?: Array<{
        key: React.Key;
        date: string;
        location: string;
        rooms: string;
        sqm: number | string;
        price: string;
    }>;
}

// Моковые данные для демонстрации
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
    }
];

const TransactionsTable: React.FC<TransactionsTableProps> = ({ rows = mockTransactions }) => {
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
                    {rows.map((r) => (
                        <tr key={r.key} className="border-t">
                            <td className="py-3">{r.date}</td>
                            <td className="py-3">{r.location}</td>
                            <td className="py-3">{r.rooms}</td>
                            <td className="py-3">{r.sqm}</td>
                            <td className="py-3 font-medium">{r.price}</td>
                            <td className="py-3 text-right">
                                <button className="px-3 py-1 border rounded-md">Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-center">
                <button className="px-4 py-2 border rounded-md">Show more</button>
            </div>
        </div>
    );
};

export default TransactionsTable;


