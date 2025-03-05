// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// const History = () => {
//   const [history, setHistory] = useState([]); // Stores history
//   const [selectedItems, setSelectedItems] = useState(new Set()); // Stores selected items
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { user } = useContext(AuthContext); // Get user token

//   // Fetch history when component loads
//   useEffect(() => {
//     if (!user || !user.token) return; // Ensure user is authenticated

//     axios
//       .get("http://localhost:5000/api/code/history", {
//         withCredentials: true,
//         headers: { Authorization: `Bearer ${user.token}` }, // Send token
//       })
//       .then((response) => {
//         console.log("📜 History Data:", response.data);
//         setHistory(response.data);
//       })
//       .catch((err) => {
//         setError(err.response?.data?.message || "Failed to fetch history");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [user]);

//   // Handle selection toggle
//   const handleSelect = (id) => {
//     setSelectedItems((prevSelected) => {
//       const newSelected = new Set(prevSelected);
//       newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
//       return newSelected;
//     });
//   };

//   // Handle delete request
//   const handleDelete = () => {
//     if (selectedItems.size === 0) return;

//     const confirmed = window.confirm("Are you sure you want to delete selected history?");
//     if (!confirmed) return;

//     axios
//       .post(
//         "http://localhost:5000/api/code/history/delete",
//         { ids: Array.from(selectedItems) },
//         { withCredentials: true, headers: { Authorization: `Bearer ${user.token}` } }
//       )
//       .then(() => {
//         setHistory((prev) => prev.filter((item) => !selectedItems.has(item._id)));
//         setSelectedItems(new Set());
//       })
//       .catch((err) => {
//         setError(err.response?.data?.message || "Error deleting history");
//       });
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-semibold mb-4">Submission History</h2>

//       {/* Delete button (only shows if something is selected) */}
//       {selectedItems.size > 0 && (
//         <button onClick={handleDelete} className="mb-4 px-4 py-2 bg-red-500 text-white rounded">
//           🗑 Delete Selected
//         </button>
//       )}

//       {/* Error & Loading Messages */}
//       {error && <p className="text-red-500">{error}</p>}
//       {loading ? (
//         <p className="text-gray-500">Loading history...</p>
//       ) : history.length > 0 ? (
//         <div className="space-y-4">
//           {history.map((item) => (
//             <div key={item._id} className="border p-4 rounded-lg shadow">
//               <input
//                 type="checkbox"
//                 checked={selectedItems.has(item._id)}
//                 onChange={() => handleSelect(item._id)}
//                 className="mr-2 cursor-pointer accent-blue-500"
//               />

//               <pre className="bg-gray-100 p-2 rounded text-sm">
//                 <strong>Code:</strong> <br />
//                 {item.code}
//               </pre>

//               <pre className="bg-gray-200 p-2 rounded text-sm mt-2">
//                 <strong>Output:</strong> <br />
//                 {item.result.output}
//               </pre>

//               <p className="text-gray-500 text-xs mt-2">
//                 <strong>Executed On:</strong> {new Date(item.result.timestamp).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">No history found.</p>
//       )}
//     </div>
//   );
// };

// export default History;
import React, { useState, useEffect, useContext } from "react";
import { getHistory } from "../api";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const History = () => {
    const [history, setHistory] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user, loading: authLoading } = useContext(AuthContext); // Get 'loading' from AuthContext

    useEffect(() => {
        console.log("History useEffect HOOK RUNNING");

        const fetchHistory = async () => {
            console.log("fetchHistory FUNCTION RUNNING");

            if (authLoading) { // <--- ADD CHECK FOR authLoading
                console.log("AuthContext LOADING... History fetch deferred.");
                return; // Exit if AuthContext is still loading
            }

            if (!user?.token) {
                console.log("Token is MISSING in History:", { user });
                setLoading(false); // Keep setLoading(false) here as well, for no-history loading state
                return;
            }

            setLoading(true); // Now set loading to true when we are actually fetching
            setError("");
            try {
                console.log("Calling getHistory API...");
                const data = await getHistory();
                console.log("📜 History Data:", data);
                setHistory(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch history");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user, authLoading]); // Add authLoading to dependency array - VERY IMPORTANT

    // ... rest of your History component (no changes needed)

    const handleSelect = (id) => {
        setSelectedItems((prevSelected) => {
            const newSelected = new Set(prevSelected);
            newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
            return newSelected;
        });
    };

    const handleDelete = () => {
        if (selectedItems.size === 0) return;

        const confirmed = window.confirm("Are you sure you want to delete selected history?");
        if (!confirmed) return;

        axios
            .post(
                "http://localhost:5000/api/code/history/delete",
                { ids: Array.from(selectedItems) },
                { withCredentials: true, headers: { Authorization: `Bearer ${user.token}` } }
            )
            .then(() => {
                setHistory((prev) => prev.filter((item) => !selectedItems.has(item._id)));
                setSelectedItems(new Set());
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Error deleting history");
            });
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Submission History</h2>

            {selectedItems.size > 0 && (
                <button onClick={handleDelete} className="mb-4 px-4 py-2 bg-red-500 text-white rounded">
                    🗑 Delete Selected
                </button>
            )}

            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p className="text-gray-500">Loading history...</p>
            ) : history.length > 0 ? (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item._id} className="border p-4 rounded-lg shadow">
                            <input
                                type="checkbox"
                                checked={selectedItems.has(item._id)}
                                onChange={() => handleSelect(item._id)}
                                className="mr-2 cursor-pointer accent-blue-500"
                            />

                            <pre className="bg-gray-100 p-2 rounded text-sm">
                                <strong>Code:</strong> <br />
                                {item.code}
                            </pre>

                            <pre className="bg-gray-200 p-2 rounded text-sm mt-2">
                                <strong>Output:</strong> <br />
                                {item.result.output}
                            </pre>

                            <p className="text-gray-500 text-xs mt-2">
                                <strong>Executed On:</strong> {new Date(item.result.timestamp).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No history found.</p>
            )}
        </div>
    );
};

export default History;