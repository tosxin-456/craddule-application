import React, { useState } from 'react';
import Header from './component/header';
import { useNavigate } from 'react-router-dom';





function Privacy ()  {
  const [isOpen, setIsOpen]= useState(false);

    const navigate = useNavigate()

    const onClickHandler = () => navigate(`/generalSetting`)

    return (
        <>
<div className=''>
        <Header />
        <div className='container'>

        <div className='main-content2'>
        <h1 className='centerHh' style={{paddingBottom:40}}>Privacy Policy</h1>
   
       <div className='bacWHI'>
          <p className='paragraph'>
          <div class="section">
        <h3>1. Introduction</h3>
        <p>Craddule (“we”, “our”, “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application and services (“Services”). Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the application.</p>

        <h3>2. Information We Collect</h3>
        <h4>Personal Information</h4>
        <p>When you register for an account, we collect personal information that you voluntarily provide to us, such as your name, email address, and phone number.</p>

        <h4>Usage Data</h4>
        <p>We may collect usage data, such as your IP address, browser type, operating system, access times, and pages viewed directly before and after accessing the application.</p>

        <h4>Cookies</h4>
        <p>We may use cookies and similar tracking technologies to track the activity on our application and store certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Services.</p>

        <h3>3. How We Use Your Information</h3>
        <h4>Provide and Manage Services</h4>
        <p>We use your information to provide, manage, and improve our Services, including facilitating project creation and collaboration.</p>

        <h4>Communication</h4>
        <p>We may use your information to send you updates, newsletters, marketing or promotional materials, and other information that may be of interest to you. You can opt-out of receiving these communications by following the unsubscribe link or instructions provided in any email we send.</p>

        <h4>Legal Compliance</h4>
        <p>We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, judicial proceedings, court orders, or legal processes.</p>

        <h3>4. Data Sharing and Disclosure</h3>
        <h4>Service Providers</h4>
        <p>We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, and email delivery. These service providers are required to protect your information and may not use it for any other purpose.</p>

        <h4>Business Transfers</h4>
        <p>In the event of a merger, acquisition, or asset sale, your personal information may be transferred to the acquiring entity.</p>

        <h4>Third-Party Links</h4>
        <p>Our application may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices or the content of such websites or services. We encourage you to read the privacy policies of any third-party websites or services you visit.</p>

        <h3>5. Data Security</h3>
        <p>We implement industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or method of electronic storage is completely secure, and we cannot guarantee the absolute security of your information.</p>

        <h3>6. Your Rights</h3>
        <h4>Access and Update</h4>
        <p>You have the right to access and update your personal information. You can do so by logging into your account or contacting us directly.</p>

        <h4>Data Deletion</h4>
        <p>You have the right to request the deletion of your personal information, subject to certain exceptions. To request the deletion of your information, please contact us at info@craddule.com.</p>

        <h3>7. Changes to This Privacy Policy</h3>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our application. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

        <h3>8. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at info@craddule.com.</p>
    </div>
          </p>
        </div>     
  </div>
  </div>
  </div>


  </>
    );
}

export default Privacy