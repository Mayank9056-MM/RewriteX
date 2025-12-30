import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/HomePage";
import ArticleDetails from "./pages/ArticleDetails";

/**
 * The App component is the entry point for the RewriteX application.
 * It contains two routes, one for the homepage and one for article details.
 * The homepage route renders the Homepage component, while the article details route renders the ArticleDetails component.
 */
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/article/:id" element={<ArticleDetails />} />
    </Routes>
  );
};

export default App;
