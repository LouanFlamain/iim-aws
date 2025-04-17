import { Routes, Route, Link } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Dashboard from "./pages/Dashboard";
import MyLists from "./pages/MyLists";
import ListDetail from "./pages/ListDetail";

function App({ signOut, user }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-xl font-bold">ToDo Amplify</h1>
        <div className="flex gap-5">
          <Link to="/">
            <button className="cursor-pointer btn">dashboard</button>
          </Link>
          <Link to="/mes-listes">
            <button className="btn cursor-pointer">mes-listes</button>
          </Link>
        </div>
        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/mes-listes" element={<MyLists user={user} />} />
          <Route path="/list/:id" element={<ListDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default withAuthenticator(App);
