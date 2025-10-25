import React, { useEffect, useState } from 'react';

type Props = {
  recordEvent: (event: string) => void;
};
const KeyLogger: React.FC<Props> = ({ recordEvent }) => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = (event) => {
      setPressedKeys((prevKeys) => new Set(prevKeys).add(event.key));
    };

    const handleKeyUp = (event) => {
      setPressedKeys((prevKeys) => {
        const newKeys = new Set(prevKeys);
        newKeys.delete(event.key);
        return newKeys;
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  useEffect(() => {
    if (pressedKeys.has('Control') && pressedKeys.has('v')) {
      recordEvent('Ctrl + v pressed!');
    }

    if (pressedKeys.has('Meta') && pressedKeys.has('v')) {
      recordEvent('Command + v pressed!');
    }
  }, [pressedKeys, recordEvent]); // Re-run effect when pressedKeys changes

  return <span className="hidden" />;
};

export default KeyLogger;
