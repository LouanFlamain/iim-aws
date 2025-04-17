import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, post } from "@aws-amplify/api";

function ListDetail() {
  const { id } = useParams();
  const [values, setValues] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [refresh, setRefresh] = useState(false);

  const fetchValues = async () => {
    try {
      const restOperation = get({
        apiName: "api",
        path: "/getTodoValues",
        options: {
          queryParams: { todoId: id },
          authMode: "userPool",
        },
      });

      const { body } = await restOperation.response;
      const data = await body.json();
      setValues(data);
    } catch (err) {
      console.error("❌ Erreur récupération des valeurs :", err);
    }
  };

  const handleAddValue = async () => {
    if (!newValue.trim()) return;

    try {
      const restOperation = post({
        apiName: "api",
        path: "/addTodoValues",
        options: {
          body: {
            todoId: id,
            value: newValue,
          },
          authMode: "userPool",
        },
      });

      await restOperation.response;
      setNewValue("");
      setRefresh(!refresh);
    } catch (err) {
      console.error("❌ Erreur ajout valeur :", err);
    }
  };

  useEffect(() => {
    fetchValues();
  }, [refresh]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Liste d'éléments 🧾</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Nouvelle tâche"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-2"
        />
        <button
          onClick={handleAddValue}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Ajouter
        </button>
      </div>

      <ul className="space-y-2">
        {values.map((val) => (
          <li
            key={val.id}
            className="p-4 bg-white rounded shadow border flex justify-between items-center"
          >
            <span>{val.value}</span>
            <span className="text-xs text-gray-400">
              {new Date(val.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListDetail;
