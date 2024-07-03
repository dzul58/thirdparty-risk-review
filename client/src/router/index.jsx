import { createBrowserRouter, redirect } from 'react-router-dom';
import Summary from '../pages/Summary';
import Login from '../pages/Login';
import Parent from '../pages/Parent';
import LinkDetail from '../pages/Linkdetail';



const aunthBeforeLogin = () => {
  const access_token = localStorage.access_token;
  if (!access_token) {
    throw redirect("/login");
  }
  return null;
};

const aunthAfterLogin = () => {
  const access_token = localStorage.access_token;
  if (access_token) {
    throw redirect("/");
  }
  return null;
};


const router = createBrowserRouter([
    // {
    //   path: "/auto-login",
    //   element: <AutoLogin />,
    //   errorElement: <ErrorPage />,
    // },
    {
      path: "/login",
      element: <Login />,
      loader: aunthAfterLogin,
    },
    {
      element: <Parent />,
      children: [
        {
          path: "/summary",
          element: <Summary />,
        },
        {
          path: "/linkdetail",
          element: <LinkDetail />,
        },
      ],
      loader: aunthBeforeLogin,
    },
  ]);
  
  export default router;