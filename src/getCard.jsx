import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { API_BASE_URL } from './config/apiConfig';
import 'react-phone-input-2/lib/style.css';
import { PaystackButton } from 'react-paystack';
import { getUserIdFromToken } from './utils/startUtils';
import { CheckCircle, CreditCard, Gift, MapPin } from 'lucide-react';

function GetCard() {
  const { access_token, userId } = getUserIdFromToken();
  console.log(userId);

  const publicKey = "pk_live_ad719098c01b1d5e280aa45492782cb661b74d46";
  // const publicKey = "pk_test_5b18272091e43f312490878eb3f0002fb4242ac6";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [timeRef, setTimeRef] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [phone, setPhone] = useState("");
  const [show, setShow] = useState(true);
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [currency, setCurrency] = useState('NGN');
  const [isAfrican, setIsAfrican] = useState(true);
  const [loading, setLoading] = useState(true);

  const payWithPaystack = () => {
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount:
        subscriptionType === "Recurring"
          ? getCurrentPricing().monthly * 100
          : getCurrentPricing().lifetime * 100,
      currency: getCurrentPricing().currency,
      metadata: {
        name,
        phone,
        subscriptionType
      },
      callback: function (response) {
        handlePaystackSuccessAction(response);
      },
      onClose: function () {
        handlePaystackCloseAction();
      }
    });

    handler.openIframe();
  };


  // Pricing based on location
  const pricing = {
    africa: {
      monthly: 15000,
      lifetime: 35000,
      currency: 'NGN'
    },
    international: {
      monthly: 15,
      lifetime: 35,
      currency: 'USD'
    }
  };

  useEffect(() => {
    // Detect user's location
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        // List of African country codes
        const africanCountries = [
          'NG'
        ];

        const isInAfrica = africanCountries.includes(data.country_code);
        setIsAfrican(isInAfrica);
        setCurrency(isInAfrica ? 'NGN' : 'USD');
        setLoading(false);
      } catch (error) {
        console.error('Error detecting location:', error);
        // Default to African pricing if location detection fails
        setIsAfrican(true);
        setCurrency('NGN');
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(API_BASE_URL + '/api/user/' + userId, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          const { firstName, lastName, email, phoneNumber, timeSent, authCode } = data;
          setEmail(email);
          setName(firstName + ' ' + lastName);
          setPhone(phoneNumber);
          setTimeRef(timeSent);
          setAuthCode(authCode);

          // Override location detection if the phone number starts with 234 (Nigeria)
          if (phoneNumber && phoneNumber.startsWith('234')) {
            setIsAfrican(true);
            setCurrency('NGN');
          }
        } else {
          const data = await response.json();
          console.log(data);
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  const getCurrentPricing = () => {
    return isAfrican ? pricing.africa : pricing.international;
  };

  const handlePaystackSuccessAction = (reference) => {
    console.log('Payment successful, reference:', reference.reference);
    localStorage.setItem('subscribed', true);
    window.location.reload()
    verifyTransaction(reference.reference);
    updateUser();
  };

  const handlePaystackCloseAction = () => {
    console.log('Payment closed');
    alert("Transaction was not completed");
  };

  const componentProps = {
    email,
    amount: subscriptionType === 'Recurring'
      ? getCurrentPricing().monthly * 100
      : getCurrentPricing().lifetime * 100,
    metadata: {
      name,
      phone,
      subscriptionType
    },
    currency: getCurrentPricing().currency,
    publicKey,
    text: "Start Free Trial",
    onSuccess: handlePaystackSuccessAction,
    onClose: handlePaystackCloseAction,
  };

  const verifyTransaction = async (data) => {
    console.log(data, publicKey);
    try {
      const res = await fetch(`https://api.paystack.co/transaction/verify/${data}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const response = await res.json();
      console.log(response);
      localStorage.setItem('auth_code', response.data.authorization.authorization_code);
      localStorage.setItem('subscribed', true);
      window.location.reload()
      updateUser(response.data.authorization.authorization_code);
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateUser = async () => {
    try {
      console.log(authCode);

      const projectId = localStorage.getItem('nProject');
      const requestBody = {
        subscriptionType,
      };

      // Only add projectId if it's needed
      if (subscriptionType !== "Recurring" && projectId) {
        requestBody.projectId = projectId;
      }

      const response = await fetch(`${API_BASE_URL}/api/user/auth/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const result = await response.json();
        console.error('Error:', result.error || 'Unknown error');
        return;
      }

      console.log('Success:', response.status);
      const responseData = await response.json();
      console.log('Response Data:', responseData);

    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const updateUserPop = async (trialPopUp) => {
    try {
      console.log(trialPopUp);
      const response = await fetch(API_BASE_URL + '/api/user/trialpopup/' + userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({ trialPopUp }),
      });

      if (response.status === 200) {
        console.log(response.status);
        const responseData = await response.json();
      } else {
        const result = await response.json();
        console.error('Error:', result['error']);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleSubscribeClick = () => {
    setSubscriptionType('Recurring'); // Set state
  };

  const handleLifetimeClick = () => {
    setSubscriptionType('One-time'); // Set state
  };

  // Use useEffect to wait for the state update before clicking the button
  useEffect(() => {
    if (subscriptionType) {
      setShow(false);
      console.log("Subscription Type:", subscriptionType);
      document.getElementsByClassName('cardBtn')[0].click();
    }
  }, [subscriptionType]); // Trigger when subscriptionType changes

  const handleCancel = () => {
    setShow(false);
    // updateUserPop('true');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-lg font-medium">Loading pricing details...</p>
        </div>
      </div>
    );
  }

  const currentPricing = getCurrentPricing();

  return (
    <>
      <div className={`${show ? "fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 px-4 sm:px-20" : "hidden"}`} id='popup'>
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-300 ease-in-out">
          {/* Close Button */}
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Title */}
          <h4 className="text-center text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Gift className="text-purple-500" size={28} />
            Subscribe to Craddule
          </h4>

          {/* Location indicator */}
          <div className="flex items-center justify-center gap-2 mb-4 text-gray-600">
            <MapPin size={18} />
            <span className="text-sm">
              {isAfrican ? "Craddule Nigeria Pricing" : "International Pricing"}
            </span>
          </div>

          {/* Description */}
          <p className="text-center text-gray-600 mb-6 leading-relaxed">
            Unlock the full potential of Craddule! Choose a plan that suits you:
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle size={20} />
              <span className="text-sm">
                <strong>{currentPricing.currency} {currentPricing.monthly.toLocaleString()} per month</strong> – Manage multiple projects seamlessly
              </span>
            </div>
            <div className="flex items-center gap-3 text-blue-600">
              <CreditCard size={20} />
              <span className="text-sm">
                <strong>{currentPricing.currency} {currentPricing.lifetime.toLocaleString()}</strong> – Lifetime access to a single project
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
              onClick={handleSubscribeClick}
            >
              <CreditCard size={20} />
              Monthly Subscription
            </button>
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
              onClick={handleLifetimeClick}
            >
              <Gift size={20} />
              Lifetime Access
            </button>
          </div>
        </div>
      </div>

      <PaystackButton className='cardBtn hidden' id='cardBtn' {...componentProps} />
    </>
  );
}

export default GetCard;