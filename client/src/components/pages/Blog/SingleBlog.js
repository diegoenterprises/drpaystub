import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";

// SingleBlog is no longer used — all articles are rendered inline on /blogs
// Redirect any old /blogs/:id links back to the knowledge base
export default function SingleBlog() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return <Redirect to="/blogs" />;
}
