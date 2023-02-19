import { RefObject, useEffect, useState } from 'react';

// THX. ChatGPT :)

export const useResizeObserver = (ref: RefObject<HTMLElement>, onChanged?: (width: number, height: number) => void) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      // Loop over the entries (there will only be one for our use case)
      for (let entry of entries) {
        // Destructure the contentRect from the observed entry
        const { width, height } = entry.contentRect;
        // Update our state with the new dimensions
        setDimensions({ width, height });
        onChanged?.(width, height)
      }
    });

    // Start observing the target element
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    // Cleanup function to disconnect the ResizeObserver when the component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return dimensions;
};