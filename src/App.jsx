import { useState } from "react";

import Login from "./components/Login";
import SearchForm from "./components/SearchForm";

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {token ? <SearchForm token={token} /> : <Login setToken={setToken} />}
    </main>
  );
};

export default App;
