import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

// ----------------------------------------------------------------------

export default function Page() {
  const location = useLocation()
  const navigator = useNavigate()

  useEffect(() => {
    if(location.pathname === "/") {
      navigator('/dashboard');
    }
  }, [location.pathname, navigator])

  return (
    <>
    </>
  );
}
