import { useState } from "react";

import Login from "./components/Login";
import SearchForm from "./components/SearchForm";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!token ? <Login setToken={setToken} /> : <SearchForm token={token} />}
    </main>
  );
};

export default App;
