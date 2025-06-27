import { BarChart } from '@mui/x-charts/BarChart';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import '../styles/reports.css';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Cookies from 'universal-cookie';
import toast from 'react-hot-toast';
import axios from 'axios';

const Reports = forwardRef(function Reports({ selectedProjectId }, ref) {
    useImperativeHandle(ref, () => ({
        refreshReports: () => {
            fetchProjectTasks(selectedProjectId);
        }
    }));

    const [projectTasks, setProjectTasks] = useState([]);
    const [noOfTasks, setNoOfTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [incompleteTasks, setIncompleteTasks] = useState(0);
    const [pData, setPData] = useState([0, 0, 0]); // Dynamic data for BarChart

    const cookie = new Cookies();

    const xLabels = ['To Do', 'Doing', 'Done'];

    const fetchProjectTasks = async (selectedProjectId) => {
        try {
            if (!selectedProjectId) {
                toast.error("No Project selected");
                setProjectTasks([]);
                return;
            }
            const token = cookie.get("token");
            if (!token) {
                toast.error("No token Provided");
                return;
            }

            const response = await axios.get(`http://localhost:5000/api/tasks/allTasks/${selectedProjectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status) {
                if (response.data?.data?.length === 0) {
                    setProjectTasks([]);
                    return;
                }
                setProjectTasks(response.data?.data);
            } else {
                toast.error(response.data.message || "Failed to fetch tasks");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "An error occurred");
        }
    };

    const computeTasks = (tasks) => {
        let ccount = 0;
        let icount = 0;
        let toDoCount = 0;
        let doingCount = 0;
        let doneCount = 0;

        tasks.forEach(task => {
            if (task.status === "done") {
                ccount++;
                doneCount++;
            } else if (task.status === "doing") {
                icount++;
                doingCount++;
            } else if (task.status === "to-do") {
                icount++;
                toDoCount++;
            }
        });

        setNoOfTasks(tasks.length);
        setCompletedTasks(ccount);
        setIncompleteTasks(icount);
        setPData([toDoCount, doingCount, doneCount]); // Update BarChart data
    };

    useEffect(() => {
        fetchProjectTasks(selectedProjectId);
    }, [selectedProjectId]);

    useEffect(() => {
        computeTasks(projectTasks);
    }, [projectTasks]);

    return (
        <div className="dashboard-content-container">
            <div className="container-content">
                <div className="dashboard-widgets">
                    <div className="widget stat">Completed tasks <span>{completedTasks}</span></div>
                    <div className="widget stat">Incomplete tasks <span>{incompleteTasks}</span></div>
                    <div className="widget stat">Overdue tasks <span>0</span></div>
                    <div className="widget stat">Total tasks <span>{noOfTasks}</span></div>
                </div>

                <div className="dashboard-charts">
                    <div className="barchart">
                        <h2 className="barchart-title">Task Progress</h2>
                        <BarChart
                            height={300}
                            series={[{ data: pData, label: 'Work', id: 'pvId' }]}
                            xAxis={[{ data: xLabels }]}
                            yAxis={[{ width: 30 }]}
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
                        {noOfTasks > 0 && (
                            <Gauge
                                key={`${completedTasks}-${noOfTasks}`} // Force rerender
                                value={completedTasks}
                                startAngle={-110}
                                endAngle={110}
                                valueMin={0}
                                cornerRadius={3}
                                valueMax={noOfTasks}
                                width={300}
                                sx={{
                                    '& .MuiGauge-root': {
                                        strokeWidth: 14,
                                    },
                                    '& .MuiGauge-referenceArc': {
                                        stroke: '#2e2e2e',
                                        strokeLinecap: 'round',
                                    },
                                    '& .MuiGauge-valueArc': {
                                        fill: '#ff3b6c',
                                        stroke: '#ff3b6c',
                                        strokeLinecap: 'round',
                                    },
                                    '& .MuiGauge-valueText': {
                                        fontSize: '2rem',
                                        fontWeight: 600,
                                    },
                                    '& text': {
                                        fill: '#fff !important',
                                    },
                                }}
                                text={({ value, valueMax }) => `${value} / ${valueMax}`}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Reports;