import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // Use a loader state to indicate loading status
    setLoader(true);

    if (authentication && !authStatus) {
      // Redirect to login if authentication is required but not authenticated
      navigate("/login");
    } else if (!authentication && authStatus) {
      // Redirect to home if authentication is not required but authenticated
      navigate("/");
    }

    // Set loader to false when the authentication check is done
    setLoader(false);
  }, [authStatus, navigate, authentication]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
