import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BlockBackNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    // Push a dummy state to prevent back navigation
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}

export default BlockBackNavigation;
