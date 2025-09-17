import React, { useEffect, useState } from 'react';
import bci from './images/bc.png'; 
import bob from './images/bob.png';
import Header from './component/header';
import Menu from './component/menu';
import {API_BASE_URL} from './config/apiConfig';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
// import HeaderIdeation from './component/headerIdeation';





function Fanancials ()  {
    const navigate = useNavigate()

    const onClickHandler = () => navigate(`/mitigation`)

    const [question, setQuestion] = useState(null);
    const access_token = localStorage.getItem('access_token');
    const decodedToken = jwtDecode(access_token);
    const userId = decodedToken.userId;

    const projectId = localStorage.getItem('nProject');
    const [loading, setLoading] = useState(false);
    console.log(userId);

    const [formData, setFormData] = useState({
        answer: '',
        });

        const handleChange = (e) => {
            setFormData({
              ...formData,
              [e.target.id]: e.target.value,
            });
          };

    const fetchUnansweredQuestion = async () => {
        try {
          const response = await fetch(API_BASE_URL+`/api/new/question/${userId}/${projectId}/BusinessCaseBuilder/RoiAndFinancials`);
          if (response.status === 200) {
            const data = await response.json();
            if (!data.data) {
            //   setNoMoreQuestions(true);
                navigate(`/mitigation`);
            } else {
              setQuestion(data.data);
            }
            // setQuestion(data.data); // Set the fetched question to state
          } else {
            const errorMessage = `Error fetching question: ${response.statusText}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
          }
        } catch (error) {
          console.error('An error occurred:', error.message);
        }
      };
    
    useEffect(() => {
       
        fetchUnansweredQuestion(); // Call the function to fetch the unanswered question
      }, [userId]);
      
      const handleSubmit = (e) => {
        e.preventDefault();
        createAnswer(formData);
      };

      const createAnswer = async (data) => {
        setLoading(true);
        
        try {
         data.userId = userId;  
         data.questionId = question._id; 
         data.projectId = projectId; 

          console.log(data);
          
          const response = await fetch(API_BASE_URL+'/api/answer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify({data}),
          });
    
          if (response.status === 200) {
            // If submission is successful, fetch another question
            const responseData = await response.json();
            console.log(responseData);

            fetchUnansweredQuestion();
            setLoading(false);
            setFormData({
                     answer: '',
                  });
          } else {
            const result = await response.json();
            setLoading(false);
            toast.error(result['error']);
            console.error('Error:', result['error']);
          }
        } catch (error) {
            //toast.error(result['error']);  
            setLoading(false);
            console.error('An error occurred:', error);
        }
      };
      //submit answer

    return (
        <>
 <div className='container-fluid'>
    <Header />
    <div className='row'>
    <Menu /> 
    <div className='col-md-9'>
        <div className='centerC'>
            <img src={bci} className='bcI'></img>
            <div className='div-box'>
                <p className='centerH'>ROI and Financials</p>
                <p className='centerHp'>Make sure you answer all questions</p>
                {/*<img src={bob} className='bro'></img>*/}
                <div class = "spaceB"></div>
               <div className='container-box'>
                  <p className='quote'>"The most difficult thing is the decision to act, the rest is merely tenancity."</p>
                  <p className='author'>- Amelia Earhart</p> 
                </div>
                <div class = "spaceB"></div>
            </div>


            {question ? (
             <form onSubmit={handleSubmit}>
            <div> 

             <p className='question'>{question.question}</p>
            <div className='container-textAs'>
                <textarea className='textAs' id="answer"  value={formData.answer} onChange={handleChange}></textarea>
            </div>
            <p className='suggest'>Your answer shouldn't be about money, It should be about solving a problem</p>
  
        <button type="submit" className="btn btn-primary curveNext" disabled={loading}>
        
        { loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin'/>}
                { !loading && <span>Next</span>}
              
              </button>
              </div> 

            
            </form>
             ) : (
                <p></p>
              )}
              </div>           
          
  </div>
  </div>
  <Toaster  position="top-right" />
  </div>
  </>
    );
}

export default Fanancials