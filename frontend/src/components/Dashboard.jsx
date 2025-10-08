// import React, { useState, useEffect, useCallback } from "react";
// import { Loader2, Sparkles, ImageIcon, History, LogOut } from "lucide-react";

// export default function Dashboard({ onLogout }) {
//   const [prompt, setPrompt] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [currentView, setCurrentView] = useState("generate");
//   const [latestImage, setLatestImage] = useState(null);
//   const [imageHistory, setImageHistory] = useState([]);

//   // Use useCallback to prevent re-creating the function on every render
//   const fetchHistory = useCallback(async () => {
//     try {
//       const res = await fetch("http://localhost:5001/api/images", {
//         credentials: "include",
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           throw new Error("Authorization failed. Please log in again.");
//         }
//         throw new Error("Failed to fetch history");
//       }

//       const data = await res.json();
//       setImageHistory(data);
//       if (data.length > 0) {
//         setLatestImage(data[0]);
//       } else {
//         setLatestImage(null);
//       }
//     } catch (err) {
//       console.error("Failed to fetch image history:", err);
//       if (err.message.includes("Authorization failed")) {
//         onLogout();
//       }
//     }
//   }, [onLogout]);

//   // Main useEffect to fetch history when the component mounts
//   useEffect(() => {
//     fetchHistory();
//   }, [fetchHistory]);

//   const handleLogout = async () => {
//     try {
//       await fetch("http://localhost:5001/api/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//     } catch (err) {
//       console.error("Logout API error:", err);
//     } finally {
//       localStorage.removeItem("token");
//       onLogout();
//     }
//   };
  
//   const handleGenerate = async (e) => {
//     e.preventDefault();
//     if (!prompt.trim()) return;

//     setIsGenerating(true);

//     try {
//       console.log("1. Starting image generation...");
      
//       // Generate image - this now automatically saves to MongoDB
//       const apiRes = await fetch("http://localhost:5001/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//       });

//       console.log("2. Generation API response status:", apiRes.status);
      
//       if (!apiRes.ok) {
//         const errorText = await apiRes.text();
//         console.error("Generation API error:", errorText);
//         throw new Error(`Generation failed with status: ${apiRes.status}`);
//       }

//       const apiData = await apiRes.json();
//       console.log("3. Generation API response:", apiData);
      
//       let { imageUrl } = apiData;
//       if (!imageUrl) throw new Error("No image URL returned from API");

//       // Fix Windows path issue - replace backslashes with forward slashes
//       imageUrl = imageUrl.replace(/\\/g, '/');
//       console.log("4. Fixed image URL:", imageUrl);

//       // ✅ No need to save separately - image is already saved in the /generate endpoint
//       console.log("5. Image automatically saved to database during generation");

//       // Refresh history to get the latest image
//       await fetchHistory();
//       console.log("6. History refreshed successfully!");

//     } catch (err) {
//       console.error("❌ Image generation process failed:", err);
//       alert(`Failed to generate image: ${err.message}`);
//     }

//     setPrompt("");
//     setIsGenerating(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900">
//       <nav className="bg-gray-800 border-b border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <div className="flex items-center space-x-4">
//               <Sparkles className="h-8 w-8 text-blue-400" />
//               <h1 className="text-xl font-bold text-white">AI Image Generator</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => setCurrentView("generate")}
//                 className={`flex items-center space-x-2 px-3 py-2 rounded ${
//                   currentView === "generate" 
//                     ? "bg-blue-600 text-white" 
//                     : "text-gray-400 hover:text-white"
//                 }`}
//               >
//                 <ImageIcon className="h-4 w-4" />
//                 <span>Generate</span>
//               </button>
//               <button
//                 onClick={() => setCurrentView("history")}
//                 className={`flex items-center space-x-2 px-3 py-2 rounded ${
//                   currentView === "history" 
//                     ? "bg-blue-600 text-white" 
//                     : "text-gray-400 hover:text-white"
//                 }`}
//               >
//                 <History className="h-4 w-4" />
//                 <span>History</span>
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white rounded"
//               >
//                 <LogOut className="h-4 w-4" />
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {currentView === "generate" && (
//           <div className="max-w-2xl mx-auto">
//             <form onSubmit={handleGenerate} className="space-y-6">
//               <div>
//                 <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
//                   Describe your image
//                 </label>
//                 <textarea
//                   id="prompt"
//                   rows={3}
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                   placeholder="A beautiful sunset over mountains with reflective lake..."
//                   className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   disabled={isGenerating}
//                 />
//               </div>
              
//               <button
//                 type="submit"
//                 disabled={!prompt.trim() || isGenerating}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 {isGenerating ? (
//                   <>
//                     <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="h-5 w-5 mr-2" />
//                     Generate Image
//                   </>
//                 )}
//               </button>
//             </form>

//             {latestImage && (
//               <div className="mt-8">
//                 <h2 className="text-lg font-medium text-white mb-4">Latest Image</h2>
//                 <div className="bg-gray-800 rounded-lg p-4">
//                   <img 
//                     src={latestImage.imageUrl} 
//                     alt={latestImage.prompt}
//                     className="w-full h-auto rounded"
//                     onError={(e) => {
//                       console.error("Image failed to load:", latestImage.imageUrl);
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                   <p className="text-gray-300 mt-2">{latestImage.prompt}</p>
//                   <p className="text-gray-500 text-xs mt-1">
//                     {new Date(latestImage.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {currentView === "history" && (
//           <div>
//             <h2 className="text-2xl font-bold text-white mb-6">Your Image History</h2>
//             {imageHistory.length === 0 ? (
//               <p className="text-gray-400 text-center">No images generated yet.</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {imageHistory.map((image) => (
//                   <div key={image.id || image._id} className="bg-gray-800 rounded-lg p-4">
//                     <img 
//                       src={image.imageUrl} 
//                       alt={image.prompt}
//                       className="w-full h-auto rounded mb-2"
//                       onError={(e) => {
//                         console.error("Image failed to load:", image.imageUrl);
//                         e.target.style.display = 'none';
//                       }}
//                     />
//                     <p className="text-gray-300 text-sm">{image.prompt}</p>
//                     <p className="text-gray-500 text-xs mt-2">
//                       {new Date(image.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Sparkles, ImageIcon, History, LogOut } from "lucide-react";

export default function Dashboard({ onLogout }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState("generate");
  const [latestImage, setLatestImage] = useState(null);
  const [imageHistory, setImageHistory] = useState([]);
  const [user, setUser] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/check-auth", {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          onLogout();
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        onLogout();
      }
    };
    
    checkAuth();
  }, [onLogout]);

  // Use useCallback to prevent re-creating the function on every render
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5001/api/images", {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Authorization failed. Please log in again.");
        }
        throw new Error("Failed to fetch history");
      }

      const data = await res.json();
      setImageHistory(data);
      if (data.length > 0) {
        setLatestImage(data[0]);
      } else {
        setLatestImage(null);
      }
    } catch (err) {
      console.error("Failed to fetch image history:", err);
      if (err.message.includes("Authorization failed")) {
        onLogout();
      }
    }
  }, [onLogout]);

  // Main useEffect to fetch history when the component mounts
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [fetchHistory, user]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      onLogout();
    }
  };
  
  // In your handleGenerate function in Dashboard.jsx
const handleGenerate = async (e) => {
  e.preventDefault();
  if (!prompt.trim()) return;

  setIsGenerating(true);

  try {
    console.log("1. Starting image generation...");
    
    const apiRes = await fetch("http://localhost:5001/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ prompt }),
    });

    console.log("2. Generation API response status:", apiRes.status);
    
    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error("Generation API error:", errorText);
      throw new Error(`Generation failed with status: ${apiRes.status}`);
    }

    const apiData = await apiRes.json();
    console.log("3. Generation API response:", apiData);
    
    // ✅ Now we get imageData instead of imageUrl
    const { imageData, id } = apiData;
    if (!imageData) throw new Error("No image data returned from API");

    console.log("4. Image saved directly to MongoDB with data URL");

    // Refresh history to get the latest image
    await fetchHistory();
    console.log("5. History refreshed successfully!");

  } catch (err) {
    console.error("❌ Image generation process failed:", err);
    alert(`Failed to generate image: ${err.message}`);
  }

  setPrompt("");
  setIsGenerating(false);
};
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Sparkles className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">AI Image Generator</h1>
                <p className="text-xs text-gray-400">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView("generate")}
                className={`flex items-center space-x-2 px-3 py-2 rounded ${
                  currentView === "generate" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                <span>Generate</span>
              </button>
              <button
                onClick={() => setCurrentView("history")}
                className={`flex items-center space-x-2 px-3 py-2 rounded ${
                  currentView === "history" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white rounded hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "generate" && (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                  Describe your image
                </label>
                <textarea
                  id="prompt"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A beautiful sunset over mountains with reflective lake..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={isGenerating}
                />
              </div>
              
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Image
                  </>
                )}
              </button>
            </form>

            {latestImage && (
              <div className="mt-8">
                <h2 className="text-lg font-medium text-white mb-4">Latest Image</h2>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <img 
                    src={latestImage.imageUrl} 
                    alt={latestImage.prompt}
                    className="w-full h-auto rounded-lg max-h-96 object-contain bg-gray-900"
                    onError={(e) => {
                      console.error("Image failed to load:", latestImage.imageUrl);
                      e.target.style.display = 'none';
                      // Show error message
                      const errorDiv = e.target.nextElementSibling;
                      if (errorDiv) errorDiv.style.display = 'block';
                    }}
                  />
                  <div className="hidden bg-gray-900 rounded-lg p-8 text-center">
                    <p className="text-gray-400">Image failed to load</p>
                    <p className="text-gray-500 text-sm mt-2">{latestImage.imageUrl}</p>
                  </div>
                  <p className="text-gray-300 mt-4 text-sm">{latestImage.prompt}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Created: {new Date(latestImage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === "history" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Your Image History</h2>
              <p className="text-gray-400">
                {imageHistory.length} image{imageHistory.length !== 1 ? 's' : ''} generated
              </p>
            </div>
            {imageHistory.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No images generated yet.</p>
                <p className="text-gray-500 mt-2">Create your first AI-generated image!</p>
                <button
                  onClick={() => setCurrentView("generate")}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Generate Image
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {imageHistory.map((image) => (
                  <div key={image.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                    <img 
                      src={image.imageUrl} 
                      alt={image.prompt}
                      className="w-full h-48 object-cover rounded-lg mb-3 bg-gray-900"
                      onError={(e) => {
                        console.error("Image failed to load:", image.imageUrl);
                        e.target.style.display = 'none';
                        // Show error message
                        const errorDiv = e.target.nextElementSibling;
                        if (errorDiv) errorDiv.style.display = 'block';
                      }}
                    />
                    <div className="hidden bg-gray-900 rounded-lg p-4 text-center h-48 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Image unavailable</p>
                    </div>
                    <p className="text-gray-300 text-sm truncate">{image.prompt}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(image.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}