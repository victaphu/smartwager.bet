import { useRouter } from "next/router";
const { createContext, useState, useEffect } = require("react");

const StakeWiseContext = createContext();

const StakeWiseProvider = ({ children }) => {
  const [active, setActive] = useState();
  const [url, setUrl] = useState();
  const router = useRouter();

  useEffect(() => {
    setUrl(router.route);
  }, [router]);

  return (
    <StakeWiseContext.Provider value={{ active, setActive, url }}>
      {children}
    </StakeWiseContext.Provider>
  );
};

export { StakeWiseContext, StakeWiseProvider };
