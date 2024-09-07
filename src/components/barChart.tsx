import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Colors,
    Tooltip,
    Legend,
} from 'chart.js'
import { ChartOptions, TooltipItem } from 'chart.js'
import { FullSkeleton } from './common/skeleton-loading'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors
)

interface BarChartProps {
    stats: {
        minPoints: number
        maxPoints: number
        count: number
    }[]
    isLoading: boolean
}

const BarChart: React.FC<BarChartProps> = ({ stats, isLoading }) => {
    if (isLoading) {
        return (
            <div>
                <FullSkeleton />
            </div>
        )
    }
    const labels = stats.map(
        (stat) => `${stat.minPoints} - ${stat.maxPoints} points`
    )
    const data = stats.map((stat) => stat.count)

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Number of Participants',
                data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                ],
                borderWidth: 1,
            },
        ],
    }
    const options: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: TooltipItem<'bar'>) {
                        return `${context.dataset.label}: ${context.raw}`
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (tickValue: string | number) {
                        if (
                            typeof tickValue === 'number' &&
                            Number.isInteger(tickValue)
                        ) {
                            return tickValue.toString() // Ensure integer values are displayed
                        }
                        return '' // Return an empty string for non-integer values
                    },
                },
                suggestedMin: 1, // Start Y-axis from 1
            },
        },
    }

    return (
        <div className="mt-20 flex flex-col items-center bg-slate-50 rounded-md p-2 text-slate-800">
            <h3>See How Others Are Doing</h3>
            <div className="max-w-lg max-h-80 w-full h-full flex justify-center">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    )
}

export default BarChart
