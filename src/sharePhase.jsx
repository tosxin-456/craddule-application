import React, { useState, useEffect } from 'react';
import ShareModal from './component/shareModal';
import { useNavigate } from 'react-router-dom';
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
import Header from './component/header';

const ImageUpload = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhases, setSelectedPhases] = useState([]);

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

  // Track checked phases for multiple selection
  const [checkedPhases, setCheckedPhases] = useState({});

  const handlePhaseToggle = (phaseName) => {
    setCheckedPhases(prev => ({
      ...prev,
      [phaseName]: !prev[phaseName]
    }));
  };

  const handleShareClick = () => {
    // Get array of selected phase names
    const selected = Object.keys(checkedPhases).filter(phase => checkedPhases[phase]);

    if (selected.length === 0) {
      alert('Please select at least one phase to share');
      return;
    }

    setSelectedPhases(selected);
    setIsOpen(true);
  };

  const onClickHandler21 = () => navigate('/feedback');

  return (
    <div className='w-[100%]'>
      <Header />
      <div className="w-[95%] m-auto relative">
        <div className="flex mt-[40px] justify-between items-center w-[100%]">
          <div className="w-fit">
            <button onClick={() => navigate('/start')} className='bg-[#193FAE] px-[30px] py-[5px] text-white rounded-3xl'>
              Back
            </button>
          </div>
          <div>
            <img src={home} alt="Home Icon" />
          </div>
        </div>
        <div className="absolute inset-0 mt-[40px] ml-[20px] sm:ml-[60px] z-[-100] bg-no-repeat bg-cover w-[150px] sm:w-[200px] h-[150px] sm:h-[200px]"
          style={{ backgroundImage: `url(${circle})` }}
        ></div>
        <div className='w-full bg-white p-2 rounded-2xl mt-5'>
          <div className='text-center'>
            <p className='centerH'>Share</p>
            <p className='centerHp'>Here you can share your work</p>
          </div>
          <div className='flex justify-between items-center'>
            <button
              className='bg-[#193FAE] px-[30px] py-[5px] text-white rounded-3xl ml-4'
              onClick={handleShareClick}
            >
              Share Selected
            </button>
            <button
              className="bg-[#193FAE] px-[30px] py-[5px] text-white rounded-3xl"
              onClick={onClickHandler21}
            >
              Feedback
            </button>
          </div>
          <div className="lg:grid grid-cols-2 lg:grid-cols-3 lg:gap-3 mt-14">
            <div className="col-span-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {phaseDetails.map((phase, index) => (
                  <div
                    key={index}
                    className={`lg:w-[225px] w-[180px] h-[305px] rounded-tr-[30px] rounded-bl-[30px] group bg-no-repeat bg-cover cursor-pointer relative`}
                    style={{ backgroundImage: `url(${phase.bgImage})` }}
                  >
                    <div className={`tilt-box bg-[${phase.bgColor}] ${phase.textColor}`}>
                      <div className="flex items-center mb-[16px]">
                        <input
                          type="checkbox"
                          id={`phase-${index}`}
                          checked={checkedPhases[phase.name] || false}
                          onChange={() => handlePhaseToggle(phase.name)}
                          className="mr-2 h-5 w-5"
                        />
                        <label htmlFor={`phase-${index}`} className="text-[14px]">
                          Select
                        </label>
                      </div>
                      <p className="p18">{phase.name}</p>
                      <p className="p18">{phase.description}</p>
                      {/* <p className="p18">{phase.documents}</p> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ShareModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            phaseNames={phaseDetails.map((phase) => phase.name)}
            selectedPhases={selectedPhases}
          />
        </div>
      </div>
      <div className="fixed bottom-0 right-0 z-[-100] m-0 p-0 w-[150px] h-[150px] bg-no-repeat"
        style={{
          backgroundImage: `url(${feedback})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          margin: '0',
          padding: '0',
        }}
      ></div>
    </div>
  );
};

export default ImageUpload;