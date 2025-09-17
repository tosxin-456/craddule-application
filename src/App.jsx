// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { clarity } from "react-microsoft-clarity";

// Authentication & User Management
import EmailConfirmation from "./confirmEmail";
import Login from "./login";
import LoginShare from "./sharelogin";
import LoginTeam from "./loginStart";
import Password from "./password";
import Profile from "./profile";
import SignUp from "./signUp";
import SignUpTeam from "./signUpStart";

// Legal
import Nda from "./nda";
import Privacy from "./privacy";
import TermAgreement from "./termAgreement";

// Onboarding & Welcome
import CradduleWelcome from "./welcome-part";
import LandingPage from "./landing";
import QuestionsForm from "./component/questionsForm";
import Start from "./start";

// Financial Overview & KPI
import CustomFinancial from "./customFinancial";
import CreateKpi from "./kpiCreate";
import Kpi from "./kpi";
import KpiView from "./kpiView";

// Pitch Deck
import PitchDeckSystem from "./powerPoint";

// Branding
import Branding from "./branding";
import BrandingUpload from "./brandingUpload";

// Team Management
import TeamAdd from "./teamAdd";
import TeamView from "./teamView";

// Tasks
import CreateTask from "./taskCreate";
import TaskProgressViewer from "./taskViewer";
import UploadTask from "./taskUpload";

// File Management
import Craddule from "./craddule";
import Subfolder from "./subfolder";
import SubFolderUpload from "./subfolderupload";

// Sharing & Collaboration
import Referral from "./refferal";
import Share from "./share";
import ShareFeedback from "./shareFeedback";
import SharePhase from "./sharePhase";
import ShareReview from "./shareReview";
import ShareView from "./shareView";

// Feedback & Summary
import ConclusionSummaryPage from "./ConclusionSummary";
import PageFeedback from "./pageFeedback";
import PhaseSummary from "./PhaseSummary";

// Settings
import GeneralSetting from "./generalSetting";

// GO / NO-GO Page
import GoPage from "./goPage";

// Utilities
import Accelerate from "./accelerate";
import ScrapCreate from "./scrapCreate";
import ScrapCreateName from "./scrapCreateName";
import ScrapView from "./scrapView";

// AI & Testing
import QuestionOptions from "./TestAi";

// Financial Charts - Data Input
import CreateCustomerGrowth from "./customerGrowthCreate";
import CreateCustomerInflux from "./customerInfluxCreate";
import CreateExpenses from "./expensesCreate";
import CreateNetProfit from "./netProfitCreate";
import CreateOperatingIncome from "./operatingIncomeCreate";
import InflationCreate from "./inflationRateCreate";

// Financial Charts - Editing
import EditCustomerGrowth from "./customerGrowthEdit";
import EditCustomerInflux from "./customerInfluxEdit";
import EditExpenses from "./expensesEdit";
import EditNetProfit from "./netProfitEdit";
import EditOperatingIncome from "./operatingIncomeEdit";
import EditInflation from "./inflationRateEdit";

// Financial Charts - Viewing (Tables & Graphs)
import CustomerGrowth from "./customerGrowth";
import CustomerInflux from "./customerInflux";
import Expenses from "./expenses";
import InflationRate from "./inflation";
import NetProfit from "./netProfit";
import OperatingIncome from "./operatingIncome";

import ViewCustomerGrowthGraph from "./customerGrowthGraphView";
import ViewCustomerInfluxGraph from "./customerInfluxGraphView";
import ViewExpensesGraph from "./expensesGraphView";
import ViewInflation from "./inflationRateGraphView";
import ViewNetProfitGraph from "./netProfitGraphView";
import ViewOperatingIncomeGraph from "./operatingIncomeGraphView";
import VerticalBusOnboarding from "./component/busStarter";
import ProtectedRoute from "./protected";

function App() {
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const subscribed = true;

  useEffect(() => {
    clarity.init("ocijdfgrpz");
    setIsTrialExpired(!subscribed);
  }, [subscribed]);

  return (
    <GoogleOAuthProvider clientId="652982067595-5ib81dgbepeqevr3868739t1bg4phrmm.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/:referralCode" element={<SignUp />} />
          <Route path="/login/start/:id/" element={<LoginTeam />} />
          <Route path="/signup/start/:id/" element={<SignUpTeam />} />
          <Route path="/share/login/:id/" element={<LoginShare />} />
          <Route path="/confirm-email" element={<EmailConfirmation />} />
          <Route path="/password" element={<Password />} />
          <Route path="/profile" element={<Profile />} />

          {/* Legal */}
          <Route path="/terms&conditions" element={<TermAgreement />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/nda/" element={<Nda />} />

          {/* Welcome & Onboarding */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/start/"
            element={
              <ProtectedRoute>
                <Start />
              </ProtectedRoute>
            }
          />
          <Route
            path="/welcome-form"
            element={
              <ProtectedRoute>
                <QuestionsForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <CradduleWelcome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/welcome-onboarding"
            element={
              <ProtectedRoute>
                <VerticalBusOnboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customFinancial/"
            element={
              <ProtectedRoute>
                <CustomFinancial />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createKpi/"
            element={
              <ProtectedRoute>
                <CreateKpi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kpi/"
            element={
              <ProtectedRoute>
                <Kpi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kpiview/:id"
            element={
              <ProtectedRoute>
                <KpiView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pitchDeck"
            element={
              <ProtectedRoute>
                <PitchDeckSystem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pitchDeckStart/"
            element={
              <ProtectedRoute>
                <PitchDeckSystem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ppt"
            element={
              <ProtectedRoute>
                <PitchDeckSystem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/branding"
            element={
              <ProtectedRoute>
                <Branding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brandingUpload"
            element={
              <ProtectedRoute>
                <BrandingUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teamView/"
            element={
              <ProtectedRoute>
                <TeamView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teamAdd/"
            element={
              <ProtectedRoute>
                <TeamAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createTask/"
            element={
              <ProtectedRoute>
                <CreateTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/uploadTask/"
            element={
              <ProtectedRoute>
                <UploadTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewTask"
            element={
              <ProtectedRoute>
                <TaskProgressViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/craddule/"
            element={
              <ProtectedRoute>
                <Craddule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/craddule/:hubType"
            element={
              <ProtectedRoute>
                <Subfolder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/craddule/:hubType/upload"
            element={
              <ProtectedRoute>
                <SubFolderUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/share/start/:id/"
            element={
              <ProtectedRoute>
                <Share />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sharereview/:id"
            element={
              <ProtectedRoute>
                <ShareReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shareview/:id/:phase"
            element={
              <ProtectedRoute>
                <ShareView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sharefeedback/:id/:phase"
            element={
              <ProtectedRoute>
                <ShareFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sharePhase/"
            element={
              <ProtectedRoute>
                <SharePhase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/referral"
            element={
              <ProtectedRoute>
                <Referral />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customerInflux"
            element={
              <ProtectedRoute>
                <CustomerInflux />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customerGrowth"
            element={
              <ProtectedRoute>
                <CustomerGrowth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operatingIncome"
            element={
              <ProtectedRoute>
                <OperatingIncome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/netProfit"
            element={
              <ProtectedRoute>
                <NetProfit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inflation/"
            element={
              <ProtectedRoute>
                <InflationRate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expensesGraphView/:id"
            element={
              <ProtectedRoute>
                <ViewExpensesGraph />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inflationGraphView/:id"
            element={
              <ProtectedRoute>
                <ViewInflation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/netProfitGraphView/:id"
            element={
              <ProtectedRoute>
                <ViewNetProfitGraph />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operatingIncomeGraphView/:id"
            element={
              <ProtectedRoute>
                <ViewOperatingIncomeGraph />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customerGrowthGraphView/:id"
            element={
              <ProtectedRoute>
                <ViewCustomerGrowthGraph />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customerInfluxGraphView/:id"
            element={
              <ProtectedRoute>
                <ViewCustomerInfluxGraph />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inflationCreate/"
            element={
              <ProtectedRoute>
                <InflationCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operatingIncomeCreate/"
            element={
              <ProtectedRoute>
                <CreateOperatingIncome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expensesCreate/"
            element={
              <ProtectedRoute>
                <CreateExpenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/netProfitCreate/"
            element={
              <ProtectedRoute>
                <CreateNetProfit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customerGrowthCreate/"
            element={
              <ProtectedRoute>
                <CreateCustomerGrowth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customerInfluxCreate/"
            element={
              <ProtectedRoute>
                <CreateCustomerInflux />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inflationEdit/:id"
            element={
              <ProtectedRoute>
                <EditInflation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operatingIncomeEdit/:id"
            element={
              <ProtectedRoute>
                <EditOperatingIncome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expensesEdit/:id"
            element={
              <ProtectedRoute>
                <EditExpenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/netProfitEdit/:id"
            element={
              <ProtectedRoute>
                <EditNetProfit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customerGrowthEdit/:id"
            element={
              <ProtectedRoute>
                <EditCustomerGrowth />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customerInfluxEdit/:id"
            element={
              <ProtectedRoute>
                <EditCustomerInflux />
              </ProtectedRoute>
            }
          />

          {/* Summary & Feedback */}
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <PageFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary-phase/:phase"
            element={
              <ProtectedRoute>
                <PhaseSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/conclusion"
            element={
              <ProtectedRoute>
                <ConclusionSummaryPage />
              </ProtectedRoute>
            }
          />

          {/* GO / NO-GO */}
          <Route
            path="/go/:phase"
            element={
              <ProtectedRoute>
                <GoPage />
              </ProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/generalSetting"
            element={
              <ProtectedRoute>
                <GeneralSetting />
              </ProtectedRoute>
            }
          />

          {/* Utilities */}
          <Route
            path="/accelerate/"
            element={
              <ProtectedRoute>
                <Accelerate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createScrap/:id"
            element={
              <ProtectedRoute>
                <ScrapCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createScrapName/"
            element={
              <ProtectedRoute>
                <ScrapCreateName />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scrapView/"
            element={
              <ProtectedRoute>
                <ScrapView />
              </ProtectedRoute>
            }
          />

          {/* AI Testing */}
          <Route
            path="/test-ai/:phase"
            element={
              <ProtectedRoute>
                <QuestionOptions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
