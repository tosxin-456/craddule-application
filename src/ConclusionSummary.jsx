import React, { useState, useEffect } from 'react';
import { FileText, Clock, Users, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from './config/apiConfig';
import Header from './component/header';
import home from './images/HOME.png'
import { useNavigate } from 'react-router-dom';

const ConclusionSummaryViewer = () => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState(null);
    const projectId = localStorage.getItem('nProject');
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate()

    // Fetch existing conclusion summary
    const fetchSummary = async () => {
        setLoading(true);
        setError(null);
        // console.log(projectId, token)
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/test-new/question/conclusion/${projectId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSummary(data.summary || '');
            } else {
                setError(data.message || 'Failed to fetch summary');
            }
        } catch (error) {
            console.error("Error fetching summary:", error);
            setError('Error fetching summary. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    // Enhanced markdown formatter with better mobile responsiveness - NO H1/H2 headers
    // Enhanced markdown formatter with better mobile responsiveness - NO H1/H2 headers
    const formatMarkdown = (text) => {
        if (!text) return '';

        let html = text;

        // Convert tables with mobile-first approach
        html = html.replace(/\|(.+)\|\n\|[\s\-\|]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
            const headerCells = header.split('|').map(cell => cell.trim()).filter(cell => cell);
            const rowsArray = rows.trim().split('\n').map(row =>
                row.split('|').map(cell => cell.trim()).filter(cell => cell)
            );

            let tableHtml = '<div class="w-full overflow-x-auto my-4 sm:my-6 -mx-2 sm:mx-0"><div class="min-w-full inline-block align-middle"><table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">';

            // Header
            tableHtml += '<thead style="background: linear-gradient(to right, #f8fafc, #f1f5f9);"><tr>';
            headerCells.forEach(cell => {
                tableHtml += `<th style="padding: 8px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; white-space: nowrap; min-width: 100px; background-color: #f8fafc;">${cell}</th>`;
            });
            tableHtml += '</tr></thead>';

            // Body
            tableHtml += '<tbody>';
            rowsArray.forEach((row, index) => {
                const bgColor = index % 2 === 0 ? '#ffffff' : '#f9fafb';
                tableHtml += `<tr style="background-color: ${bgColor};">`;
                row.forEach((cell) => {
                    const isNumeric = /^\$?[\d,]+$/.test(cell.trim());
                    const fontWeight = isNumeric ? '500' : '400';
                    const color = isNumeric ? '#111827' : '#374151';
                    tableHtml += `<td style="padding: 8px 12px; font-size: 12px; color: ${color}; font-weight: ${fontWeight}; border-right: 1px solid #f3f4f6; white-space: nowrap; min-width: 100px; background-color: ${bgColor};">${cell}</td>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</tbody></table></div></div>';

            return tableHtml;
        });

        // Header conversions
        html = html.replace(/^######\s+(.*$)/gm, '<h6 class="text-sm sm:text-base font-semibold text-black mt-4 sm:mt-5 mb-2 sm:mb-3">$1</h6>');
        html = html.replace(/^#####\s+(.*$)/gm, '<h5 class="text-base sm:text-lg font-semibold text-black mt-5 sm:mt-6 mb-3 sm:mb-4">$1</h5>');
        html = html.replace(/^#{4}\s+(.*$)/gm, '<h4 class="text-base sm:text-lg font-semibold text-black mt-6 sm:mt-8 mb-3 sm:mb-4 pb-2 border-b border-gray-200">$1</h4>');
        html = html.replace(/^#{3}\s+(.*$)/gm, '<h3 class="text-lg sm:text-xl font-bold text-black mt-8 sm:mt-10 mb-4 sm:mb-6 pb-3 border-b-2 border-blue-200">$1</h3>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-black">$1</strong>');

        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em class="italic text-black">$1</em>');

        // Bullet points
        html = html.replace(/^\s*[\*\-]\s+(.*)$/gm, '<li class="ml-4 sm:ml-6 mb-2 text-black text-sm sm:text-base relative"><span class="absolute -left-3 sm:-left-4 text-blue-500">•</span>$1</li>');

        // Numbered lists
        html = html.replace(/^(\d+)\.\s+(.*)$/gm, '<li class="ml-5 sm:ml-6 mb-2 text-black text-sm sm:text-base relative"><span class="absolute -left-5 sm:-left-6 text-blue-600 font-medium">$1.</span>$2</li>');

        // Wrap lists
        html = html.replace(/(<li class="ml-[45] sm:ml-6 mb-2[^>]*>.*<\/li>\s*)+/g, '<ul class="space-y-1 my-3 sm:my-4">$&</ul>');

        // Paragraph conversion
        html = html.replace(/\n\n/g, '</p><p class="mb-3 sm:mb-4 text-black text-sm sm:text-base leading-relaxed">');

        // Initial paragraph wrap if not already in tags
        if (!html.startsWith('<')) {
            html = '<p class="mb-3 sm:mb-4 text-black text-sm sm:text-base leading-relaxed">' + html;
        }
        if (!html.endsWith('>')) {
            html += '</p>';
        }

        return html;
    };


    const downloadSummary = () => {
        const element = document.createElement('a');
        const file = new Blob([summary], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = `conclusion-summary-${projectId}.md`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-black text-sm sm:text-base">Loading summary...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                fontFamily: '"Manrope", sans-serif'
            }}
            className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />

            {/* Navigation Header - Mobile Optimized */}
            <div className="w-full px-3 sm:px-4 max-w-full sm:max-w-2xl mx-auto flex justify-between items-center mt-4 md:mt-10">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-[#193FAE] px-3 sm:px-4 md:px-6 py-2 text-white text-sm sm:text-base rounded-3xl shadow-md hover:bg-[#162E8D] transition flex-shrink-0"
                >
                    Back
                </button>
                <p className='text-lg sm:text-xl md:text-2xl font-bold text-center mx-2 min-w-0 flex-1'>Project Summary</p>
                {/* {!nextPhase && ( */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button
                        onClick={() => navigate('/pitchDeck')}
                        className="bg-[#193FAE] p-2 text-white rounded-full shadow-md hover:bg-[#162E8D] transition"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                    </button>
                    <span>Pitch Deck</span>
                </div>
                {/* // )} */}
            </div>

            {/* Main Content - Mobile Optimized */}
            <div className="mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 max-w-full">
                {/* Error Message - Mobile Optimized */}
                {error && (
                    <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mx-2 sm:mx-0">
                        <div className="flex items-start space-x-2 text-red-800 mb-2">
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                            <span className="font-medium text-sm sm:text-base">Error</span>
                        </div>
                        <p className="text-red-700 text-sm sm:text-base break-words leading-relaxed">{error}</p>
                        <button
                            onClick={fetchSummary}
                            className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Summary Content - Mobile Optimized */}
                {summary && (
                    <div className="bg-white rounded-lg shadow-sm mb-6 sm:mb-8 mx-2 sm:mx-0 overflow-hidden">
                        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
                            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start sm:items-center space-x-2 min-w-0">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <p className=" text-4xl font-semibold text-black break-words leading-tight">
                                        Investor-Ready Business Summary
                                    </p>
                                </div>
                                {/* Uncomment if download functionality is needed
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-black">
                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span>Generated: {new Date().toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={downloadSummary}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 self-start"
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span>Download</span>
                                    </button>
                                </div>
                                */}
                            </div>
                        </div>
                        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                            <div
                                className="prose prose-gray prose-sm sm:prose-base max-w-none break-words overflow-hidden"
                                style={{ wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}
                                dangerouslySetInnerHTML={{
                                    __html: formatMarkdown(summary)
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Empty State - Mobile Optimized */}
                {!summary && !loading && !error && (
                    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-12 text-center mx-2 sm:mx-0">
                        <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-black mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-black mb-2">No Summary Available</h3>
                        <p className="text-black mb-6 text-sm sm:text-base px-2 sm:px-4 leading-relaxed">
                            No conclusion summary found for this project.
                        </p>
                        <button
                            onClick={fetchSummary}
                            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto text-sm sm:text-base"
                        >
                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Refresh</span>
                        </button>
                    </div>
                )}

                {/* Info Cards - Mobile Optimized */}
                {summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0">
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1 pr-3">
                                    <p className="text-xs sm:text-sm font-medium text-black mb-1">Document Type</p>
                                    <p className="text-sm sm:text-lg font-semibold text-black truncate">Investor Report</p>
                                </div>
                                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConclusionSummaryViewer;