import React, { useState } from 'react';
import logo from './images/logo.png'
import { useNavigate } from 'react-router-dom';





function TermAgreement ()  {
  const [isOpen, setIsOpen]= useState(false);

    const navigate = useNavigate()

    const onClickHandler = () => navigate(`/generalSetting`)

    return (
      <>
        <div className=''>
          <div className='w-full flex justify-center mt-12 mb-20'>
            <div className='m-auto flex justify-start items-center gap-[6px]'>
              <img src={logo} className='w-[80.12px] h-[80px]'></img>
              <span className='text-[40px] font-medium'>Craddule</span>
            </div>
          </div>
          <div className='container'>
            <div className='main-content2'>
              <h1 className='centerHh' style={{paddingBottom:40}}>Terms & Conditions</h1>
              <div className='bacWHI'>
                <p className='paragraph'>
                  <div class="section">
                    <h3>1. Introduction</h3>
                    <p>Welcome to Craddule (“we”, “our”, “us”). These Terms and Conditions (“Terms”) govern your use of our application and services (“Services”). By accessing or using our application, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, you must not use our application.</p>

                    <h3>2. Definitions</h3>
                    <ul>
                      <li><strong>Application or Services or We or Us or Our:</strong> Refers to Craddule, including all related software, services, and content.</li>
                      <li><strong>User:</strong> Refers to any individual or entity who accesses or uses the application.</li>
                      <li><strong>Content or Your Content:</strong> Refers to any data, information, text, graphics, photos, videos, or other materials uploaded, created, or shared by users within the application.</li>
                      <li><strong>Projects:</strong> Refers to specific initiatives or tasks created by users within the application aimed at understanding the business impact of their ideas.</li>
                    </ul>

                    <h3>3. Eligibility</h3>
                    <p>To use our application, you must be at least 18 years old and have the legal capacity to enter into these Terms. By using the application, you represent and warrant that you meet these eligibility requirements.</p>

                    <h3>4. Your Content</h3>
                    <p>Our Services allow you to create, store, or share Your Content or receive material from others. We don’t claim ownership of Your Content. Your Content remains yours and you are responsible for it. When you share Your Content with other people, you understand that they may be able to, on a worldwide basis, use, save, record, reproduce, broadcast, transmit, share, and display Your Content for the purpose that you made Your Content available on the Services without compensating you. If you do not want others to have that ability, do not use the Services to share Your Content. You represent and warrant that for the duration of these Terms, you have (and will have) all the rights necessary for Your Content that is uploaded, stored, or shared on or through the Services and that the collection, use, and retention of Your Content will not violate any law or rights of others. Craddule cannot be held responsible for Your Content or the material others upload, store, or share using the Services.</p>

                    <h3>5. Creating an Account</h3>
                    <p>You can create a Craddule account (hereinafter referred to as account) by signing up online. You agree not to use any false, inaccurate, or misleading information when signing up for your account. In some cases, a third party, like your Internet service provider, may have assigned an account to you. If you received your account from a third party, the third party may have additional rights over your account, like the ability to access or delete your account. Please review any additional terms the third party provided you, as Craddule has no responsibility regarding these additional terms. If you create an account on behalf of an entity, such as your business or employer, you represent that you have the legal authority to bind that entity to these Terms. You cannot transfer your account credentials to another user or entity. To protect your account, keep your account details and password confidential. You are responsible for all activity that occurs under your account.</p>

                    <h4>Account Use</h4>
                    <p>You must use your account to keep it active. This means you must sign in at least once in a [State time users must sign in. Needed for data retention policies] period to keep your account and associated Services active, unless a longer period is provided. If you don’t sign in during this time, we will assume your account is inactive and will close it for you. If we reasonably suspect that your account is at risk of being used by a third party fraudulently (for example, as a result of an account compromise), Craddule may suspend your account until you can reclaim ownership. Based on the nature of the compromise, we may be required to disable access to some or all of Your Content. If you are having trouble accessing your account, please visit this website: [Link for help to access account].</p>

                    <h4>Closing Your Account</h4>
                    <p>You can cancel specific Services or close your account at any time and for any reason. To close your account, please visit [Link to Close Account]. When you ask us to close your account, you can choose to put it in a suspended state for either 30 or 60 days just in case you change your mind. After that 30- or 60-day period, your account will be closed. Logging back in during the suspension period will reactivate your account.</p>
                    <p>If your account is closed (whether by you or us), a few things happen. First, your right to use the account to access the Services stops immediately. Second, we’ll delete Data or Your Content associated with your account or will otherwise disassociate it from you and your account (unless we are required by law to keep it, return it, or transfer it to you or a third party identified by you). You should have a regular backup plan as we won’t be able to retrieve Your Content or Data once your account is closed. Third, you may lose access to products you’ve acquired.</p>

                    <h3>6. User Responsibilities</h3>
                    <h4>Registration</h4>
                    <p>Users must provide accurate, current, and complete information during the registration process and update such information to keep it accurate, current, and complete.</p>

                    <h4>Account Security</h4>
                    <p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. Users must notify us immediately of any unauthorized use of their account.</p>

                    <h4>Prohibited Activities</h4>
                    <p>Users must not engage in any activity that:</p>
                    <ul>
                      <li>Violates any applicable law or regulation.</li>
                      <li>Infringes on the rights of any third party, including intellectual property rights.</li>
                      <li>Is fraudulent, deceptive, or misleading.</li>
                      <li>Interferes with or disrupts the application or servers or networks connected to the application.</li>
                    </ul>

                    <h3>7. Project Creation and Management</h3>
                    <h4>Project Creation</h4>
                    <p>Users can create and manage projects aimed at understanding the business impact of their ideas. Each project must comply with all applicable laws and regulations.</p>

                    <h4>Project Management</h4>
                    <p>Users are responsible for the content and data they upload or create within the application. Users must ensure that their projects do not contain any harmful or illegal content.</p>

                    <h4>Collaboration</h4>
                    <p>Users can invite team members to collaborate on projects. Users must ensure that all team members comply with these Terms.</p>

                    <h3>8. Data Security and Privacy</h3>
                    <h4>Data Protection</h4>
                    <p>We are committed to protecting user data and ensuring that it is secure and only accessible to authorized team members. We implement industry-standard security measures to protect user data from unauthorized access, disclosure, alteration, or destruction.</p>

                    <h4>User Responsibilities</h4>
                    <p>Users must not share their login credentials with unauthorized individuals and must take appropriate measures to protect their account information.</p>

                    <h4>Privacy Policy</h4>
                    <p>Our Privacy Policy, which is incorporated by reference into these Terms, provides detailed information on how we collect, use, and protect user data.</p>

                    <h4>Service Notifications</h4>
                    <p>When there’s something we need to tell you about this Service, we’ll send you Service notifications. If you gave us your email address or phone number in connection with your account, then we may send Service notifications to you via email or via SMS (text message), including to verify your identity before registering your email or mobile phone number and verifying your purchases. We may also send you Service notifications by other means (for example by in-product messages). Data or messaging rates may apply when you receive notifications via SMS.</p>

                    <h4>Support</h4>
                    <p>Customer support for some Services is available at [Link to Support]. Support may not be available for preview or beta versions (as discussed below), or for Services that have been retired or we no longer support. The Services might not be compatible with software or Services provided by third parties, and you are responsible for familiarizing yourself with the compatibility requirements.</p>

                    <h3>9. Intellectual Property</h3>
                    <p>All intellectual property rights in the application and its content, including but not limited to trademarks, logos, and copyrighted materials, are owned by or licensed to us. Users are granted a limited, non-exclusive, non-transferable license to use the application for personal and non-commercial purposes only.</p>

                    <h3>10. Limitation of Liability</h3>
                    <p>We are not responsible for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our application. Our total liability to you for any claims arising from or relating to the use of the application is limited to the amount you paid for the application.</p>

                    <h3>11. Governing Law</h3>
                    <p>These Terms are governed by and construed in accordance with the laws of the jurisdiction in which Craddule operates. Any disputes arising out of or in connection with these Terms will be resolved in the courts of that jurisdiction.</p>

                    <h3>12. Modifications to the Terms</h3>
                    <p>We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting the revised Terms on our application. By continuing to use the application after the changes are made, you agree to be bound by the revised Terms.</p>

                    <h3>13. Termination</h3>
                    <p>We may terminate or suspend your access to the application at any time, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the application will immediately cease.</p>

                    <h3>14. Miscellaneous</h3>
                    <h4>Entire Agreement</h4>
                    <p>These Terms constitute the entire agreement between you and Craddule and supersede any prior agreements or understandings, whether written or oral, relating to the subject matter of these Terms.</p>

                    <h4>Severability</h4>
                    <p>If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.</p>

                    <h4>Waiver</h4>
                    <p>The failure of either party to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.</p>

                    <h4>Contact Us</h4>
                    <p>If you have any questions about these Terms, please contact us at info@craddule.com.</p>
                  </div>    
                </p>             
              </div>     
            </div>
          </div>
        </div>
      </>
    );
}

export default TermAgreement