import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from "chart.js";

// Регистрируем нужные модули Chart.js (версия 4+)
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Описываем структуру данных для LineChart
const data: ChartData<"line"> = {
    labels: ["January", "February", "March"],
    datasets: [
        {
            label: "My Dataset",
            data: [100, 200, 150],
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            tension: 0.1,
            fill: false,
        },
    ],
};

// Настраиваем опции графика
const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
        legend: {
            display: true,
        },
        title: {
            display: true,
            text: "Пример графика на Chart.js",
        },
    },
};

const MyChart: React.FC = () => {
    return (
        <div style={{ width: "100%", maxWidth: 600 }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default MyChart;
