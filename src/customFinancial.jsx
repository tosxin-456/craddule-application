import React, { useEffect, useState } from 'react';
import bci from './images/bc.png';
import bro from './images/bro.png';
import Header from './component/header';
// import Menu from './component/menu';
// // import SideMenu2 from './component/sideMenu2';
import { API_BASE_URL } from './config/apiConfig';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
// //  import HeaderIdeationfrom './component/headerIdeation';
import graph6 from './images/graph6.png'
import graph1 from './images/graph1.png'
import graph2 from './images/graph2.png'
import graph3 from './images/graph3.png'
import graph4 from './images/graph4.png'
import graph5 from './images/graph5.png'
import home from './images/HOME.png';

function CustomFinancial() {

  const navigate = useNavigate()
  const onClickNext = () => navigate(`/inflation`);
  const onClickNext2 = () => navigate(`/operatingIncome`);
  const onClickNext3 = () => navigate(`/expenses`);
  const onClickNext4 = () => navigate(`/netProfit`);
  const onClickNext5 = () => navigate(`/customerInflux`);
  const onClickNext6 = () => navigate(`/customerGrowth`);
  const access_token = localStorage.getItem('access_token');
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;

  const projectId = localStorage.getItem('nProject');
  console.log(userId);

  // const navigate = useNavigate();
  // const onClickIF = () => navigate(`/Inflation`);

  return (
    <div className="">
      {/* <SideMenu2 />     */}
      <div className="w-full">
        <Header />
        <div
          className="main-content2"
          style={{ paddingLeft: 40, paddingRight: 40 }}
        >
          <div className=" flex justify-evenly">
            <div className="mr-auto ">
              <button className="mainBtn" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
            <div>
              <img src={home} />
            </div>
          </div>

          <div className="text-center">
            <p className="textHp">Custom Financial Projection</p>
            <p className="textH">You will need a Profesional</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="columnGraph" onClick={onClickNext}>
              <img src={graph6} alt="Inflation Rate" className="imgX" />
              <p className="graphName">Inflation Rate</p>
            </div>

            <div className="columnGraph" onClick={onClickNext2}>
              <img src={graph5} alt="Operating Income" className="imgX" />
              <p className="graphName">Operating Income</p>
            </div>

            <div className="columnGraph" onClick={onClickNext3}>
              <img src={graph3} alt="Expenses" className="imgX" />
              <p className="graphName">Expenses</p>
            </div>

            <div className="columnGraph" onClick={onClickNext4}>
              <img src={graph2} alt="Net Profit" className="imgX" />
              <p className="graphName">Net Profit</p>
            </div>

            <div className="columnGraph" onClick={onClickNext5}>
              <img src={graph4} alt="Customer Influx" className="imgX" />
              <p className="graphName">Customer Influx</p>
            </div>

            <div className="columnGraph" onClick={onClickNext6}>
              <img src={graph1} alt="Company Growth Rate" className="imgX" />
              <p className="graphName">Company Growth Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




export default CustomFinancial;
