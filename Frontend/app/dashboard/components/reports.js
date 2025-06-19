import { BarChart } from '@mui/x-charts/BarChart';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import '../styles/reports.css';
import { forwardRef, useImperativeHandle } from 'react';

const Reports = forwardRef(function Reports(props, ref) {
    useImperativeHandle(ref, () => ({
        refreshReports: () => {
            // If reports become dynamic, add refresh logic here
        }
    }));

    const pData = [5, 6, 4];
    const xLabels = [
        'To Do',
        'Doing',
        'Done',
    ];
    return (
        <div className="dashboard-content-container">
            <div className="container-content">
                <div className="dashboard-widgets">
                    <div className="widget stat">Completed tasks <span>3</span></div>
                    <div className="widget stat">Incomplete tasks <span>1</span></div>
                    <div className="widget stat">Overdue tasks <span>0</span></div>
                    <div className="widget stat">Total tasks <span>4</span></div>
                </div>

                <div className="dashboard-charts">

                    <div className="barchart">

                        <h2 className="barchart-title">Task Progress</h2>

                        <BarChart
                            height={300}
                            series={[{ data: pData, label: 'Work', id: 'pvId' }]}
                            xAxis={[{ data: xLabels }]}
                            yAxis={[{ width: 30 }]} // optional: only if vertical layout desired
                            colors={['#ff3b6c']}
                            sx={{
                                '.MuiChartsAxis-tickLabel': {
                                    fill: '#ffffff !important',
                                },
                                '.MuiChartsAxis-label': {
                                    color: '#ffffff !important',
                                    fontSize: '16 !important',
                                },
                                '.MuiChartsAxis-line, .MuiChartsAxis-tick': {
                                    stroke: '#ffffff !important',
                                    fontSize: 20,
                                },
                                '.MuiChartsGridLine-root': {
                                    stroke: '#ffffff',
                                },
                                '.MuiChartsLegend-root': {
                                    color: '#ffffff',
                                    fontSize: 20,
                                },
                                '.MuiChartsLegend-label': {
                                    fill: '#ffffff !important',
                                },
                                '.MuiChartsTooltip-root': {
                                    color: '#ffffff',
                                    backgroundColor: '#333333',
                                },
                                '.MuiBarElement-root': {
                                    width: '60px !important',
                                },
                            }}
                        />

                    </div>

                    <div className="Gaugechart">

                        <h2 className="Gauge-title">Task Completion</h2>

                        <Gauge
                            value={3}
                            startAngle={-110}
                            endAngle={110}
                            valueMin={0}
                            cornerRadius={3}
                            valueMax={4}
                            width={300} // Control size here
                            sx={{
                                // Gauge container
                                '& .MuiGauge-root': {
                                    strokeWidth: 14,
                                },
                                // Background arc
                                '& .MuiGauge-referenceArc': {
                                    stroke: '#2e2e2e',
                                    strokeLinecap: 'round',
                                },
                                // Filled arc
                                '& .MuiGauge-valueArc': {
                                    fill: '#ff3b6c', // your brand color
                                    strokeLinecap: 'round',
                                    // filter: 'drop-shadow(0 0 6px #ff3b6c)', // optional glow effect
                                },
                                // Value text in center
                                '& .MuiGauge-valueText': {
                                    fontSize: '2rem',
                                    fontWeight: 600,
                                },
                                '& text': {
                                    fill: '#fff !important', // Fallback for SVG
                                },
                            }}
                            text={({ value, valueMax }) => `${value} / ${valueMax}`}
                        />


                    </div>
                </div>



            </div>
        </div>
    )
});

export default Reports;