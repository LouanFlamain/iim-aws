import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { get, post } from "@aws-amplify/api";
import { useNavigate } from "react-router-dom";

function MyLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchLists = async () => {
    try {
      const user = await getCurrentUser();
      const sub = user.userId;

      const restOperation = get({
        apiName: "api",
        path: "/getLists",
        options: {
          queryParams: { sub },
          authMode: "userPool",
        },
      });

      const { body } = await restOperation.response;
      const data = await body.json();

      setLists(data);
    } catch (err) {
      console.error("❌ Erreur API.get :", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!name.trim()) return setError("Le nom de la liste est requis.");
    setError("");

    try {
      const user = await getCurrentUser();
      const sub = user.userId;

      const restOperation = post({
        apiName: "api",
        path: "/addList",
        options: {
          body: {
            name,
            owner: sub,
          },
          authMode: "userPool",
        },
      });

      await restOperation.response;
      setName("");
      fetchLists(); // Refresh la liste après ajout
    } catch (err) {
      console.error("❌ Erreur création :", err);
      setError(err.message || "Erreur serveur");
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Mes listes 🗂️</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Nom de la nouvelle liste"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-2"
        />
        <button
          onClick={handleCreateList}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Créer la liste
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : lists.length === 0 ? (
        <p className="text-gray-500">Aucune liste pour l'instant.</p>
      ) : (
        <ul className="space-y-2">
          {lists.map((list) => (
            <li
              key={list.id}
              onClick={() => navigate(`/list/${list.id}`)}
              className="p-4 bg-white rounded shadow border flex justify-between items-center cursor-pointer hover:bg-gray-100 transition"
            >
              <span>{list.name}</span>
              <span className="text-xs text-gray-400">
                {new Date(list.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyLists;
