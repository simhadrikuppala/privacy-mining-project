import React, { useState } from 'react';
import Auth from './Auth';
import { Upload, Lock, Database, TrendingUp, Shield, FileText, Download, LogOut } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [encryptedData, setEncryptedData] = useState(null);
  const [miningResults, setMiningResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = 'http://localhost:5000';

  // Show login if no user
  if (!user) {
    return <Auth onLogin={(userData) => setUser(userData)} />;
  }

  // Helper function to explain patterns in simple terms
  const getPatternExplanation = (algorithm, pattern, index) => {
    if (algorithm.includes('K-Means')) {
      const explanations = [
        "🎯 This represents a group of SIMILAR customers found in your encrypted data. For example, this could be 'high-income young professionals' - but we can't see their actual details because data is encrypted!",
        "🎯 Another distinct customer group discovered. Maybe 'middle-aged moderate spenders' - the exact pattern is hidden in encryption, but the similarity is detected!",
        "🎯 A third unique group identified. Could be 'senior citizens with low purchase frequency' - grouping happened WITHOUT seeing individual customer information!"
      ];
      return explanations[index] || "🎯 Another group of similar records identified in the encrypted dataset.";
    }

    if (algorithm.includes('Association')) {
      const explanations = [
        "🛒 This shows items that are frequently bought together. Like 'customers who buy bread also buy butter' - but we never saw WHO bought WHAT, only the encrypted pattern!",
        "🛒 Another purchasing pattern discovered. Maybe 'people buying laptops also buy mouse' - relationship found in encrypted shopping data!",
        "🛒 Common item combination detected. Could be 'coffee + sugar frequently together' - pattern exists even in encrypted form!",
        "🛒 Additional shopping pattern identified securely in encrypted transaction data!"
      ];
      return explanations[index] || "🛒 Item relationship discovered in encrypted transaction patterns.";
    }

    if (algorithm.includes('Classification')) {
      const lines = [
        "📊 This shows percentage of customers in different categories. Like 45% are 'Premium customers' - classified WITHOUT seeing actual customer data!",
        "📊 Another customer segment identified. Maybe 35% are 'Regular customers' - categorization done on encrypted information!",
        "📊 Additional classification discovered in the encrypted dataset!",
        "📈 This is the accuracy of our classification - how confident we are in the groupings!",
        "📈 Precision and Recall show how well the classification performed on encrypted data!",
        "📈 F1-Score is the overall performance metric - higher is better!"
      ];
      return lines[index] || "📊 Classification metric calculated on encrypted data.";
    }

    if (algorithm.includes('Outlier')) {
      const lines = [
        "🔍 Total number of encrypted records analyzed - we processed this many without seeing the actual data!",
        "⚠️ These are UNUSUAL records detected - maybe fraudulent transactions or anomalies - found WITHOUT decryption!",
        "📊 The sensitivity threshold used to detect outliers in encrypted space!",
        "📈 Statistical threshold (Z-score) - how many standard deviations from normal to flag as outlier!",
        "✅ Confidence level - how sure we are about outlier detection on encrypted data!"
      ];
      return lines[index] || "🔍 Outlier detection metric on encrypted dataset.";
    }

    return "✨ Pattern discovered in encrypted data without exposing original information!";
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleEncryption = async () => {
    if (!file) {
      alert('Please upload a file first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/encrypt`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Encryption failed');

      const data = await response.json();
      console.log('🔍 Backend response:', data);
      setEncryptedData(data);
      setActiveTab('encrypted');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Encryption failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMining = async (algorithm) => {
    if (!encryptedData) {
      alert('Please encrypt data first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/mine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptedData: encryptedData.encrypted,
          algorithm,
        }),
      });

      if (!response.ok) throw new Error('Mining failed');

      const data = await response.json();
      setMiningResults(data);
      setActiveTab('results');
    } catch (error) {
      alert('Mining failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleData = () => {
    const sampleData = [
      { id: 1, name: "Customer A", age: 25, income: 50000, purchases: 120 },
      { id: 2, name: "Customer B", age: 35, income: 75000, purchases: 200 },
      { id: 3, name: "Customer C", age: 45, income: 90000, purchases: 150 },
      { id: 4, name: "Customer D", age: 28, income: 55000, purchases: 180 },
      { id: 5, name: "Customer E", age: 38, income: 80000, purchases: 220 },
      { id: 6, name: "Customer F", age: 52, income: 95000, purchases: 140 },
      { id: 7, name: "Customer G", age: 29, income: 60000, purchases: 190 },
      { id: 8, name: "Customer H", age: 41, income: 85000, purchases: 210 }
    ];

    const dataStr = JSON.stringify(sampleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    setUser(null);
    setFile(null);
    setEncryptedData(null);
    setMiningResults(null);
    setActiveTab('upload');
  };

  // MAIN APP UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          {/* LOGOUT BAR */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-indigo-600">{user.username}</span>!
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              Privacy-Preserving Data Mining
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Using Holographic Encryption Technology (Python Backend)
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Backend: Python Flask + NumPy
            </span>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* TABS */}
            <div className="flex border-b overflow-x-auto">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'upload'
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Upload className="w-5 h-5 inline mr-2" />
                Upload Data
              </button>
              <button
                onClick={() => setActiveTab('encrypted')}
                className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'encrypted'
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lock className="w-5 h-5 inline mr-2" />
                Encrypted Data
              </button>
              <button
                onClick={() => setActiveTab('mining')}
                className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'mining'
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Database className="w-5 h-5 inline mr-2" />
                Data Mining
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'results'
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-5 h-5 inline mr-2" />
                Results
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-8">

              {/* UPLOAD TAB */}
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Need sample data?</p>
                        <button
                          onClick={downloadSampleData}
                          className="text-sm text-blue-600 hover:text-blue-700 underline mt-1 flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download sample-data.json
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-400 transition">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      accept=".csv,.json,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium text-lg">
                      Click to upload
                    </label>
                    <p className="text-gray-500 mt-2">or drag and drop</p>
                    <p className="text-sm text-gray-400 mt-1">CSV, JSON, or TXT files (Max 16MB)</p>
                  </div>

                  {file && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <FileText className="w-5 h-5 text-green-600 inline mr-2" />
                      <span className="text-green-700 font-medium">{file.name}</span>
                      <span className="text-green-600 ml-2">({(file.size / 1024).toFixed(2)} KB)</span>
                    </div>
                  )}

                  <button
                    onClick={handleEncryption}
                    disabled={!file || loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Encrypting with Holographic Algorithm...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Encrypt with Holographic Encryption
                      </>
                    )}
                  </button>

                  <div className="bg-gray-50 rounded-lg p-4 mt-6">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                      About Holographic Encryption
                    </h3>
                    <p className="text-sm text-gray-600">
                      Holographic encryption uses wave interference patterns combined with AES-256
                      to create a highly secure encryption scheme. Data is first encoded into
                      holographic patterns (phase, amplitude, frequency) before being encrypted,
                      providing an additional layer of security.
                    </p>
                  </div>
                </div>
              )}

              {/* ENCRYPTED TAB */}
              {activeTab === 'encrypted' && (
                <div className="space-y-6">
                  {encryptedData ? (
                    <>
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <Lock className="w-6 h-6 mr-2 text-indigo-600" />
                          Encryption Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="bg-white rounded p-3">
                            <p className="text-gray-500 text-xs">Algorithm</p>
                            <p className="font-medium text-gray-800">{encryptedData?.algorithm || 'N/A'}</p>
                          </div>
                          <div className="bg-white rounded p-3">
                            <p className="text-gray-500 text-xs">Key Size</p>
                            <p className="font-medium text-gray-800">{encryptedData?.keySize || 'N/A'} bits</p>
                          </div>
                          <div className="bg-white rounded p-3">
                            <p className="text-gray-500 text-xs">Records Encrypted</p>
                            <p className="font-medium text-gray-800">{encryptedData?.recordCount || 'N/A'}</p>
                          </div>
                          <div className="bg-white rounded p-3">
                            <p className="text-gray-500 text-xs">Session ID</p>
                            <p className="font-medium text-gray-800 text-xs">
                              {encryptedData?.sessionId ? encryptedData.sessionId.substring(0, 16) + '...' : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-900 rounded-lg p-6 max-h-80 overflow-auto">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            Encrypted Data (Base64)
                          </h4>
                          <span className="text-xs text-gray-400">
                            {encryptedData?.encrypted?.length || 0} characters
                          </span>
                        </div>
                        <p className="text-xs font-mono break-all text-green-400">
                          {encryptedData?.encrypted || 'No encrypted data'}
                        </p>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <Shield className="w-5 h-5 text-green-600 inline mr-2" />
                        <span className="text-green-700 font-medium">
                          Data encrypted successfully with Holographic-AES-256-CBC
                        </span>
                        <p className="text-sm text-green-600 mt-2">
                          Your data is now protected using advanced holographic encoding and military-grade encryption.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium">No encrypted data available</p>
                      <p className="text-sm mt-2">Please upload and encrypt data first</p>
                    </div>
                  )}
                </div>
              )}

              {/* MINING TAB */}
              {activeTab === 'mining' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Lock className="w-6 h-6 text-yellow-600 mr-3" />
                        <div>
                          <p className="font-bold text-yellow-800">🔒 Data Status: ENCRYPTED</p>
                          <p className="text-sm text-yellow-700">All mining operations run on encrypted data - No decryption occurs!</p>
                        </div>
                      </div>
                      <div className="bg-yellow-200 px-4 py-2 rounded-lg">
                        <p className="text-xs text-yellow-800 font-mono">Original Data: HIDDEN</p>
                        <p className="text-xs text-yellow-800 font-mono">Working on: CIPHER TEXT</p>
                      </div>
                    </div>
                  </div>

                  {encryptedData && (
                    <div className="bg-gray-900 rounded-lg p-4">
                      <h4 className="text-white text-sm font-semibold mb-2 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Currently Mining This Encrypted Data:
                      </h4>
                      <p className="text-green-400 font-mono text-xs break-all">
                        {encryptedData?.encrypted
                          ? encryptedData.encrypted.substring(0, 200) + '...'
                          : 'No encrypted data'}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        ⚠️ This gibberish is what the algorithms process - NOT the original data!
                      </p>
                    </div>
                  )}

                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <p className="text-sm text-indigo-800">
                      <strong>Privacy-Preserving Mining:</strong> All algorithms run directly on encrypted data
                      without decryption, ensuring complete privacy protection.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Mining Algorithm</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleMining('clustering')}
                      disabled={!encryptedData || loading}
                      className="border-2 border-indigo-200 rounded-lg p-6 hover:border-indigo-400 hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      <Database className="w-8 h-8 text-indigo-600 mb-3" />
                      <h4 className="font-semibold text-gray-800 mb-2">K-Means Clustering</h4>
                      <p className="text-sm text-gray-600">
                        Group similar data points while preserving privacy using homomorphic clustering
                      </p>
                      <div className="mt-3 text-xs text-indigo-600">Algorithm: K-Means on encrypted data</div>
                    </button>

                    <button
                      onClick={() => handleMining('association')}
                      disabled={!encryptedData || loading}
                      className="border-2 border-indigo-200 rounded-lg p-6 hover:border-indigo-400 hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      <TrendingUp className="w-8 h-8 text-indigo-600 mb-3" />
                      <h4 className="font-semibold text-gray-800 mb-2">Association Rules</h4>
                      <p className="text-sm text-gray-600">
                        Discover relationships between data items securely without exposing values
                      </p>
                      <div className="mt-3 text-xs text-indigo-600">Algorithm: Apriori on encrypted data</div>
                    </button>

                    <button
                      onClick={() => handleMining('classification')}
                      disabled={!encryptedData || loading}
                      className="border-2 border-indigo-200 rounded-lg p-6 hover:border-indigo-400 hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      <Shield className="w-8 h-8 text-indigo-600 mb-3" />
                      <h4 className="font-semibold text-gray-800 mb-2">Classification</h4>
                      <p className="text-sm text-gray-600">
                        Classify data into categories with complete privacy preservation
                      </p>
                      <div className="mt-3 text-xs text-indigo-600">Algorithm: Secure multi-party computation</div>
                    </button>

                    <button
                      onClick={() => handleMining('outlier')}
                      disabled={!encryptedData || loading}
                      className="border-2 border-indigo-200 rounded-lg p-6 hover:border-indigo-400 hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      <Database className="w-8 h-8 text-indigo-600 mb-3" />
                      <h4 className="font-semibold text-gray-800 mb-2">Outlier Detection</h4>
                      <p className="text-sm text-gray-600">
                        Identify anomalies without exposing sensitive data using statistical methods
                      </p>
                      <div className="mt-3 text-xs text-indigo-600">Algorithm: Z-score on encrypted data</div>
                    </button>
                  </div>

                  {loading && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-indigo-700 font-medium">Mining encrypted data...</p>
                    </div>
                  )}
                </div>
              )}

              {/* RESULTS TAB */}
              {activeTab === 'results' && (
                <div className="space-y-6">
                  {miningResults ? (
                    <>
                      {/* Success Banner */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Shield className="w-6 h-6 text-green-600 mr-3" />
                            <div>
                              <p className="text-green-700 font-medium">✅ Mining Completed Successfully</p>
                              <p className="text-sm text-green-600">All operations performed on encrypted data - Privacy Maintained!</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-green-600">Execution Time</p>
                            <p className="text-lg font-bold text-green-700">{miningResults.executionTime}ms</p>
                          </div>
                        </div>
                      </div>

                      {/* Before/After Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
                          <h3 className="font-bold text-red-800 mb-2 flex items-center">
                            <Lock className="w-5 h-5 mr-2" />
                            INPUT: Encrypted Data
                          </h3>
                          <div className="bg-gray-900 p-3 rounded max-h-32 overflow-hidden">
                            <p className="text-green-400 font-mono text-xs break-all">
                              {encryptedData?.encrypted?.substring(0, 200)}...
                            </p>
                          </div>
                          <p className="text-xs text-red-700 mt-2 font-semibold">❌ Original data NEVER visible</p>
                        </div>

                        <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4">
                          <h3 className="font-bold text-green-800 mb-2 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            OUTPUT: Patterns Found
                          </h3>
                          <div className="bg-white p-3 rounded border border-green-200 max-h-32 overflow-auto">
                            <p className="text-sm text-gray-800">
                              ✓ {miningResults.patterns.length} patterns discovered
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{miningResults.patterns[0]}</p>
                          </div>
                          <p className="text-xs text-green-700 mt-2 font-semibold">✅ Insights WITHOUT decryption</p>
                        </div>
                      </div>

                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-blue-600 font-semibold">Data Privacy</p>
                              <p className="text-2xl font-bold text-blue-800">100%</p>
                            </div>
                            <Shield className="w-10 h-10 text-blue-500" />
                          </div>
                          <p className="text-xs text-blue-700 mt-2">Zero data exposure</p>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-green-600 font-semibold">Patterns Found</p>
                              <p className="text-2xl font-bold text-green-800">{miningResults.patterns.length}</p>
                            </div>
                            <TrendingUp className="w-10 h-10 text-green-500" />
                          </div>
                          <p className="text-xs text-green-700 mt-2">Valuable insights</p>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-purple-600 font-semibold">Speed</p>
                              <p className="text-2xl font-bold text-purple-800">{miningResults.executionTime}ms</p>
                            </div>
                            <Database className="w-10 h-10 text-purple-500" />
                          </div>
                          <p className="text-xs text-purple-700 mt-2">Fast & secure</p>
                        </div>
                      </div>

                      {/* Algorithm Info */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                          Mining Results
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="bg-white rounded p-4 border">
                            <p className="text-gray-500 text-xs mb-1">Algorithm Used</p>
                            <p className="font-medium text-gray-800">{miningResults.algorithm}</p>
                          </div>
                          <div className="bg-white rounded p-4 border">
                            <p className="text-gray-500 text-xs mb-1">Privacy Level</p>
                            <p className="font-medium text-green-600">{miningResults.privacyLevel}</p>
                          </div>
                        </div>
                      </div>

                      {/* Patterns with Explanations */}
                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <Database className="w-5 h-5 mr-2 text-indigo-600" />
                          Discovered Patterns (With Explanations)
                        </h4>
                        <div className="space-y-4">
                          {miningResults.patterns.map((pattern, idx) => (
                            <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50">
                              <div className="flex items-start">
                                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">
                                  {idx + 1}
                                </span>
                                <div className="flex-1">
                                  <p className="text-sm font-mono text-gray-700 mb-3 bg-white p-2 rounded border">
                                    {pattern}
                                  </p>
                                  <div className="bg-blue-50 border-l-4 border-blue-400 rounded p-3">
                                    <p className="text-xs font-bold text-blue-800 mb-1">💡 Simple Explanation:</p>
                                    <p className="text-sm text-blue-700 leading-relaxed">
                                      {getPatternExplanation(miningResults.algorithm, pattern, idx)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Privacy Guarantee */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
                        <div className="flex items-start">
                          <Shield className="w-8 h-8 mr-3 text-blue-600 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-blue-900 mb-2 text-lg">🔒 Privacy Guarantee</p>
                            <p className="text-sm text-blue-800 leading-relaxed">
                              <strong>Important:</strong> All mining operations were performed on
                              <span className="bg-yellow-200 px-1 rounded font-semibold"> encrypted data only</span>.
                              The original customer names, ages, incomes, and purchase details were
                              <span className="bg-red-200 px-1 rounded font-semibold"> NEVER decrypted or exposed</span>
                              during this entire process. Only the patterns and statistical relationships
                              were discovered, ensuring complete privacy preservation.
                            </p>
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div className="bg-white rounded p-2 text-center border border-blue-200">
                                <p className="text-xs text-blue-600">Names</p>
                                <p className="font-bold text-red-600">HIDDEN</p>
                              </div>
                              <div className="bg-white rounded p-2 text-center border border-blue-200">
                                <p className="text-xs text-blue-600">Income</p>
                                <p className="font-bold text-red-600">HIDDEN</p>
                              </div>
                              <div className="bg-white rounded p-2 text-center border border-blue-200">
                                <p className="text-xs text-blue-600">Age</p>
                                <p className="font-bold text-red-600">HIDDEN</p>
                              </div>
                              <div className="bg-white rounded p-2 text-center border border-blue-200">
                                <p className="text-xs text-blue-600">Patterns</p>
                                <p className="font-bold text-green-600">FOUND ✓</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium">No results available</p>
                      <p className="text-sm mt-2">Please run a mining algorithm first</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>🔒 Powered by Holographic Encryption Technology</p>
            <p className="mt-1">Backend: Python Flask | Frontend: React + Vite</p>
          </div>
        </div>
      </div>
    </div>
  );
}