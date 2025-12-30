import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ArticleProvider } from "./context/ArticleContext.jsx";

createRoot(document.getElementById("root")).render(
  <ArticleProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ArticleProvider>
);
