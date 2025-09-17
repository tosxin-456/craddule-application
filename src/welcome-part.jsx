import { ArrowRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CradduleWelcome() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                {/* Welcome Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-600 rounded-full p-4">
                        <Heart className="h-10 w-10 text-white" />
                    </div>
                </div>

                {/* Main Welcome Message */}
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Welcome to <span className="text-indigo-600">Craddule</span>
                </h1>

                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    We're thrilled to have you here! The next page will introduce you to what we do
                    and show you the phases you'll experience while working with us.
                </p>

                {/* Simple CTA */}
                <button
                    onClick={() => navigate(`/welcome-form`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Let's Get Started
                    <ArrowRight className="h-5 w-5 ml-2" />
                </button>
            </div>
        </div>
    );
}