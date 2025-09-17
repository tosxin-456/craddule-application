import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactApexChart from 'react-apexcharts';
// import ApexCharts from 'apexcharts';
import Header from './component/header';
import Menu from './component/menu';
import {API_BASE_URL} from './config/apiConfig';
// // import SideMenu2 from './component/sideMenu2';
import { useNavigate,Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import home from './images/HOME.png';

function KpiView({projectId, graphType }) {

  const navigate = useNavigate()
    

    const [graphData, setGraphData] = useState([]);
    const [selectedGraphData, setSelectedGraphData] = useState(null);
    const [graphName, setGraphName] = useState('');
    
    const [deviceType, setDeviceType] = useState('desktop');
    const { id } = useParams(); 

// Function to update deviceType state based on window width
const updateDeviceType = () => {
    if (window.innerWidth < 768) {
        setDeviceType('mobile');
    } else if (window.innerWidth < 1024) {
        setDeviceType('tablet');
    } else {
        setDeviceType('desktop');
    }
};
// Effect to update isMobile state on window resize
useEffect(() => {
  updateDeviceType();
  window.addEventListener('resize', updateDeviceType);
  return () => window.removeEventListener('resize', updateDeviceType);
}, []);


useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/kpi/${id}`); // Use the ID from route parameters
        if (!response.ok) {
          throw new Error('Failed to fetch graph data');
        }

        const data = await response.json();
        console.log(data);
        setGraphData(data);

        if (data) {
          setSelectedGraphData(data);
        }
      } catch (error) {
        console.error('Error fetching graph data:', error);
      } 
    };

    fetchData();
  }, [id]); 
  

  const transformGraphData = (graphData) => {
    if (!graphData) return null;

    //const { kpiGraphType, kpi.axis } = graphData;
    console.log(graphData.kpi.axis);
    const { kpiGraphType, axis } = graphData;
    const seriesData = graphData.kpi.axis.map(item => ({ x: item.x, y: parseFloat(item.y) }));
    console.log(seriesData);
    switch (graphData.kpi.kpiGraphType.toLowerCase()) {
      case 'histogram':
        return {
          series: [{ name: 'Data', data: seriesData }],
          options: {
            chart: { height: 350, type: 'bar' },
            plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2, colors: ['transparent'] },
            xaxis: { categories: graphData.kpi.axis.map(item => item.x) },
            yaxis: { title: { text: 'Value' } },
            fill: { opacity: 1 },
            tooltip: { y: { formatter: (val) => val } }
          }
        };

      case 'area':
        return {
          series: [{ name: 'Data', data: seriesData }],
          options: {
            chart: { height: 350, type: 'area' },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth' },
            xaxis: { type: 'datetime', categories: graphData.kpi.axis.map(item => item.x) },
            tooltip: { x: { format: 'dd/MM/yy HH:mm' } }
          }
        };

      case 'donut':
        return {
          series: graphData.kpi.axis.map(item => parseFloat(item.y)),
          options: {
            chart: { type: 'donut' },
            labels: graphData.kpi.axis.map(item => item.x),
            responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
          }
        };

      case 'pie':
        return {
          series: graphData.kpi.axis.map(item => parseFloat(item.y)),
          options: {
            chart: { width: 380, type: 'pie' },
            labels: graphData.kpi.axis.map(item => item.x),
            responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
          }
        };

      case 'radar':
        return {
          series: [{ name: 'Series 1', data: graphData.kpi.axis.map(item => parseFloat(item.y)) }],
          options: {
            chart: { height: 350, type: 'radar' },
            title: { text: 'Basic Radar Chart' },
            xaxis: { categories: graphData.kpi.axis.map(item => item.x) }
          }
        };

      case 'treemap':
        return {
          series: [{ data: graphData.kpi.axis.map(item => ({ x: item.x, y: parseFloat(item.y) })) }],
          options: {
            legend: { show: false },
            chart: { height: 350, type: 'treemap' },
          }
        };

      case 'polar':
        return {
          series: graphData.kpi.axis.map(item => parseFloat(item.y)),
          options: {
            chart: { width: 380, type: 'polarArea' },
            labels: graphData.kpi.axis.map(item => item.x),
            fill: { opacity: 1 },
            stroke: { width: 1, colors: undefined },
            yaxis: { show: false },
            legend: { position: 'bottom' },
            plotOptions: {
              polarArea: { rings: { strokeWidth: 0 }, spokes: { strokeWidth: 0 } }
            },
            theme: {
              monochrome: { enabled: true, shadeTo: 'light', shadeIntensity: 0.6 }
            }
          }
        };

      default:
        return null;
    }
  };

    const chartData = transformGraphData(selectedGraphData);

  

 
      return (

        <div>
    <Header />
    <div className=' w-[90%] m-auto '>
          <div className="flex mt-[40px] justify-between items-center w-[100%]">
            <div className="w-fit">
              <button onClick={() => navigate(-1)} className='bg-[#193FAE] px-[30px] py-[5px] text-white rounded-3xl'>
                Back
              </button>
            </div>
            <div>
              <img src={home} alt="Home Icon" />
            </div>
          </div>
        <div className=" w-full ">
        <div className="">
            <p>{graphName}</p>
        </div>
        
        <div className="">
          <div className="">
                <div className="graphC">
                  <div id="chart">
                  {selectedGraphData && (
                <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type={chartData.options.chart.type}
                    height={deviceType === 'mobile' ? 250 : deviceType === 'tablet' ? 300 : 350}
                    width={deviceType !== 'desktop' ? '100%' : 700}
                />
            )}
                  </div>
                  <div id="html-dist"></div>
                </div>

          </div>
        </div>

      
</div>
</div>
</div>
      );
    }




  export default KpiView;
