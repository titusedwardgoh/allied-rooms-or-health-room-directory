"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";

const ListingFlowContext = createContext(false);
const SetListingFlowContext = createContext(() => {});

export function ListingFlowProvider({ children }) {
  const [active, setActive] = useState(false);

  return (
    <SetListingFlowContext.Provider value={setActive}>
      <ListingFlowContext.Provider value={active}>
        {children}
      </ListingFlowContext.Provider>
    </SetListingFlowContext.Provider>
  );
}

export function useListingFlow() {
  return useContext(ListingFlowContext);
}

export function useDraftPreviewHeader(active) {
  const setActive = useContext(SetListingFlowContext);

  useLayoutEffect(() => {
    setActive(Boolean(active));
    return () => setActive(false);
  }, [active, setActive]);
}
