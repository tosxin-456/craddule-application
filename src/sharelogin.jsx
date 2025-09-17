import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { API_BASE_URL } from './config/apiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from './images/logo.png';
import design from './images/design.png';
import loginImage from './images/login.png';
import { ToastContainer } from 'react-toastify';

function LoginShare() {
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCustomField, setShowCustomField] = useState(false);
    const [customSpeciality, setCustomSpeciality] = useState('');
    const [error, setError] = useState('');


    // Construct the full URL
    const link = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        // speciality: '',
        uniqueCode: id,
        // link: link
    });

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id === 'speciality' && value === 'Other') {
            setShowCustomField(true);
            setFormData({ ...formData, [id]: value });
        } else if (id === 'speciality') {
            setShowCustomField(false);
            setFormData({ ...formData, [id]: value });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleCustomSpecialityChange = (e) => {
        const value = e.target.value;
        setCustomSpeciality(value);
        setFormData({ ...formData, speciality: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // If "Other" is selected, use the custom value
        const dataToSubmit = { ...formData };
        if (formData.speciality === 'Other' && customSpeciality) {
            dataToSubmit.speciality = customSpeciality;
        }

        loginUser(dataToSubmit);
    };

    const handleSignClick = () => {
        navigate(`/share/start/${id}`);
    };

    const loginUser = async (data) => {
        setLoading(true);
        try {
            console.log(data);
            const response = await fetch(`${API_BASE_URL}/api/share/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.status === 200) {
                const responseData = await response.json();
                const { token } = responseData;
                console.log(responseData.user.howDidYouKnowUs)
                if (responseData.user.status === 'deactivated') {
                    toast.error("This Account has been Deactivated");
                } else {

                    localStorage.removeItem("username");
                    localStorage.removeItem("password");
                    localStorage.removeItem("rememberMe");

                    localStorage.setItem('access_token', token);
                    // localStorage.setItem("onboarding", responseData.onboarding || false);
                    localStorage.setItem("gottenThrough", responseData.user.howDidYouKnowUs || false);

                    navigate(`/home`);
                }
            } else {
                const result = await response.json();
                setLoading(false);
                console.log(result)
                // toast.error(result.error);
            }
        } catch (error) {
            setLoading(false);
            toast.error('An error occurred. Please try again.');
            console.error('An error occurred:', error);
        }
    };

    return (
        <>
            <div className='mt-[100px]'></div>
            <div className='w-[95%] m-auto lg:grid lg:grid-cols-2 bg-white rounded-xl'>
                <div className='bg-[#193FAE] hidden lg:block relative'>
                    <img src={design} alt="Design element" className="w-[196px] h-[219px] absolute bottom-0 right-0" />
                    <img src={design} alt="Design element" className="w-[196px] h-[219px] absolute top-0 left-0 rotate-180" />
                    <div className='flex justify-center items-center h-full'>
                        <div className='w-fit m-auto'>
                            <img src={loginImage} className='m-auto' alt="Login illustration" />
                            <h4 className='font-semibold text-white w-3/4 text-center m-auto mt-3'>Welcome back!</h4>
                            <p className='text-[16px] text-white w-2/3 text-center m-auto mt-2'>Login to continue working on your ideas.</p>
                        </div>
                    </div>
                </div>
                <div className='lg:p-10 lg:px-20 p-1 px-1 pt-10 lg:pt-16 lg:pb-20'>
                    <div className='flex justify-start items-center lg:gap-[6px] relative -top-8 lg:-left-12 -left-10'>
                        <img src={logo} className='w-[40.12px] h-[40px]' alt="Craddule logo" />
                        <span className='text-[16px] font-semibold'>Craddule</span>
                    </div>

                    <div className='pt-3'>
                        <h3 className='font-bold'>Login</h3>
                        <p className='text-[16px] text-black200'>Access your Reviewer account</p>

                        <form onSubmit={handleSubmit}>
                            <div className="inputs-container">
                                <label htmlFor="email" className='lab'>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="custom-input"
                                    required
                                />

                                <label htmlFor="password" className='lab'>Password</label>
                                <div className="password-input-container relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="custom-input w-full pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle absolute right-3 top-1/2 transform -translate-y-1/2"
                                        onClick={handleTogglePassword}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>

                                {/* <label htmlFor="speciality" className='lab'>Select Expertise:</label>
                                <select
                                    id="speciality"
                                    value={formData.speciality === customSpeciality ? 'Other' : formData.speciality}
                                    onChange={handleChange}
                                    className="custom-input w-full"
                                    required
                                >
                                    <option value="">Select Expertise</option>
                                    <option value="Accountant">Accountant</option>
                                    <option value="Actor">Actor</option>
                                    <option value="Architect">Architect</option>
                                    <option value="Artist">Artist</option>
                                    <option value="Astronomer">Astronomer</option>
                                    <option value="Author">Author</option>
                                    <option value="Chef">Chef</option>
                                    <option value="Coach">Coach</option>
                                    <option value="Consultant">Consultant</option>
                                    <option value="Content Creator">Content Creator</option>
                                    <option value="Dentist">Dentist</option>
                                    <option value="Designer">Designer</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Economist">Economist</option>
                                    <option value="Engineer">Engineer</option>
                                    <option value="Entrepreneur">Entrepreneur</option>
                                    <option value="Farmer">Farmer</option>
                                    <option value="Graphic Designer">Graphic Designer</option>
                                    <option value="Journalist">Journalist</option>
                                    <option value="Lawyer">Lawyer</option>
                                    <option value="Marketer">Marketer</option>
                                    <option value="Musician">Musician</option>
                                    <option value="Nurse">Nurse</option>
                                    <option value="Pharmacist">Pharmacist</option>
                                    <option value="Photographer">Photographer</option>
                                    <option value="Pilot">Pilot</option>
                                    <option value="Professor">Professor</option>
                                    <option value="Psychologist">Psychologist</option>
                                    <option value="Researcher">Researcher</option>
                                    <option value="Scientist">Scientist</option>
                                    <option value="Social Worker">Social Worker</option>
                                    <option value="Software Developer">Software Developer</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Technician">Technician</option>
                                    <option value="Veterinarian">Veterinarian</option>
                                    <option value="Writer">Writer</option>
                                    <option value="Other">Other</option>
                                </select>

                                {showCustomField && (
                                    <div className="mt-2">
                                        <label htmlFor="customSpeciality" className='lab'>Specify your expertise:</label>
                                        <input
                                            type="text"
                                            id="customSpeciality"
                                            value={customSpeciality}
                                            onChange={handleCustomSpecialityChange}
                                            className="custom-input w-full"
                                            placeholder="Enter your expertise"
                                            required={formData.speciality === 'Other'}
                                        />
                                    </div>
                                )} */}

                                <div className="flex justify-between items-center mt-2 mb-6">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="remember" className="mr-2" />
                                        <label htmlFor="remember" className="text-sm">Remember me</label>
                                    </div>
                                    <a href="/forgot-password" className="text-sm text-[#1B45BF]">Forgot password?</a>
                                </div>
                            </div>

                            <button className='btn loginBtn w-full' type="submit" disabled={loading}>
                                {loading ? <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' /> : <span>Login</span>}
                            </button>
                        </form>

                        <p className='mt-8 font-medium text-[16px]'>
                            New to Craddule?
                            <a
                                className='ps-2 no-underline text-[#1B45BF] cursor-pointer'
                                onClick={() => navigate(`/share/start/${id}`)}
                            >
                                Sign Up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default LoginShare;