import React from "react";

export default function useClientSideOnly() {
  const [isBrowserEnv, setIsBrowserEnv] = React.useState(false);

  React.useEffect(() => {
    setIsBrowserEnv(true);
  }, []);

  return isBrowserEnv;
}
