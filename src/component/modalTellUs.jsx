import React, { useState } from "react";
import ReactDOM from "react-dom";
import { jwtDecode } from "jwt-decode";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import {API_BASE_URL} from '../config/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

export default function ModalStart({ open, onClose }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [feedback, setFeedback] = useState(''); // Updated state for feedback

    const handleChange = (e) => {
        setFeedback(e.target.value); // Handle textarea input change
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        createFeedback({ feedback }); // Submit feedback instead of project name
    };

    const createFeedback = async (data) => {
        setLoading(true);
        try {
            const access_token = localStorage.getItem('access_token');
            const decodedToken = jwtDecode(access_token);
            const userId = decodedToken.userId;

            // Include user ID and project ID (if applicable) in the data object
            data.userId = userId;
            data.projectId = localStorage.getItem('nProject'); // Assuming the project ID is stored in localStorage

            const response = await fetch(`${API_BASE_URL}/api/tellus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.status === 200) {
                const responseData = await response.json();
                setLoading(false);
                setErrorMessage('Feedback submitted successfully');
               // navigate(`/thankYouPage`); // Navigate to a thank you page after successful submission
                console.log('Feedback submitted successfully:', responseData);
            } else {
                const result = await response.json();
                console.log(result);
                setLoading(false);
                setErrorMessage(result.error || 'Failed to submit feedback');
                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
                console.error('Error:', result.error);
            }
        } catch (error) {
            setLoading(false);
            setErrorMessage('An error occurred. Please try again.');
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
            console.error('An error occurred:', error);
        }
    };

    if (!open) return null;

    return ReactDOM.createPortal(
        <>
            <div className="modalOv"></div>
            <div className="modalSt">
            <span className="closeFr" onClick={onClose}>X</span>
                {errorMessage && <p className="createER">{errorMessage}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-containerC">
                        <textarea
                            value={feedback}
                            onChange={handleChange}
                            placeholder="Give us your feedback"
                            rows="4"
                            cols="46"
                            required
                        />
                    </div>
                    <button type="submit" className="createBT" disabled={loading}>
                        {loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin colw' />}
                        {!loading && <span className='iconSB'><span className="iconh"><HiOutlineArrowSmallRight /></span></span>}
                    </button>
                </form>
            </div>
        </>,
        document.getElementById('portal')
    );
}