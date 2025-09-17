import React, { useState, useEffect } from 'react';
import Header from './component/header';
import Menu from './component/menu';
import ShareModal from './component/shareModal';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from './config/apiConfig';
import API_BASE_WEB_URL from './config/apiConfigW';
import ideation from './images/ideation.png';
import product from './images/product_definition.png';
import design from './images/initial_design.png';
import validate from './images/validating.png';
import commerce from './images/commercialization.png';
import kpi from './images/kpi.png';
import home from './images/HOME.png';
//  import HeaderIdeationfrom './component/headerIdeation';
import circle from './images/circle.png';
import feedback from './images/feedback.svg';

import axios from 'axios';
const phaseNames = [
  'Ideation',
  'Product Definition',
  'Prototyping',
  'Initial Design',
  'Validating and Testing',
  'Commercialization'
];

function PageShare() {
  const [share, setShare] = useState([]);
  const [shareProject, setShareProject] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [circles, setCircles] = useState(new Array(6).fill(false));

  const access_token = localStorage.getItem('access_token');
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  const { id } = useParams();
  // Clear localStorage on initial load

  const fetchShare = async () => {

    try {
      console.log(userId);
      const response = await fetch(`${API_BASE_URL}/api/share/give/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}` // Include the token in the Authorization header
        }
      });

      console.log("here");
      console.log("here");
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setShare(data.data);
        setShareProject(data.data.projectId._id);
        console.log(data.data.projectId._id);

      } else {
        const result = await response.json();
        console.error('Error:', result['error']);
      }

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {
    fetchShare();
  }, []);
  const navigate = useNavigate()
  const phaseDetails = [
    {
      name: 'Ideation', bgColor: '#E8C400D9', bgImage: ideation, textColor: 'text-black', description: 'Create your Idea from start to finish',
      documents: '7 Documents'
    },
    {
      name: 'Product Definition', bgColor: '#333333DE', bgImage: product, textColor: 'text-white', description: 'Design your business processes and flow',
      documents: '4 Documents',
    },
    {
      name: 'Initial Design', bgColor: '#193FAEDE', bgImage: design, textColor: 'text-white', description: 'Plan design and add members to Team',
      documents: '2 Documents',
    },
    {
      name: 'Validating and Testing', bgColor: '#FFD700DE', bgImage: validate, textColor: 'text-black', description: 'Test and validate your product',
      documents: '3 Documents',
    },
    {
      name: 'Commercialization', bgColor: '#333333DE', bgImage: commerce, textColor: 'text-white', description: 'Get your product ready to launch for production',
      documents: '2 Documents',
    },
  ];


  return (
    <>
      <div className=' w-[100%] '>
        <Header />
        <div className=" w-[95%] m-auto relative">
          {/* <div className="flex mt-[40px] justify-between items-center w-[100%]">
            <div className="w-fit">
              <button onClick={() => navigate('/start')} className='bg-[#193FAE] px-[30px] py-[5px] text-white rounded-3xl'>
                Back
              </button>
            </div>
            <div>
              <img src={home} alt="Home Icon" />
            </div>
          </div> */}
          <div className="absolute inset-0 mt-[40px] ml-[20px] sm:ml-[60px] z-[-100] bg-no-repeat bg-cover w-[150px] sm:w-[200px] h-[150px] sm:h-[200px]"
            style={{ backgroundImage: `url(${circle})` }}
          ></div>

          <div className='w-full bg-white p-2 rounded-2xl mt-5 '>
            <div className='text-center'>
              <p className='centerH'>Share</p>
              <p className='centerHp'>Here you can share your work</p>
            </div>
            <div className="lg:grid grid-cols-2 lg:grid-cols-3 lg:gap-3 mt-14">
              <div className="col-span-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* <p className='centerH1v'>Phase</p> */}
                  {share.phases && share.phases.length > 0 && share.phases.map((phase, phaseIndex) => {
                    // Find the matching phase details
                    const phaseDetail = phaseDetails.find(detail => detail.name === phase);

                    return (
                      phaseDetail && (
                        <a
                          key={`${share._id}-${phaseIndex}`}
                          href={`${API_BASE_WEB_URL}/shareview/${shareProject}/${phase}`}
                          style={{ textDecoration: 'none' }}
                        >
                        <div
                          key={`${share._id}-${phaseIndex}`}
                          className={`lg:w-[225px] w-[180px] h-[305px] rounded-tr-[30px] rounded-bl-[30px] group bg-no-repeat bg-cover cursor-pointer relative`}
                          style={{ backgroundImage: `url(${phaseDetail.bgImage})` }}
                        >
                          <div className={`tilt-box bg-[${phaseDetail.bgColor}] ${phaseDetail.textColor}`}>
                            <p className="p18">{phaseDetail.name}</p>
                            <p className="p18">{phaseDetail.description}</p>
                            <p className="p18">{phaseDetail.documents}</p>
                          </div>
                        </div>
                        </a>
                      )
                    );
                  })}

                </div>


              </div>
            </div>

            <div className='col-md-2'>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageShare;
