import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearBuffer({ onComplete }) {
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);
  const [finished, setFinished] = React.useState(false);

  const calledRef = React.useRef(false);

  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      if (progress >= 100) {
        setProgress(100);
        setBuffer(100);
        if (!calledRef.current) {
          calledRef.current = true;
          setFinished(true);
          if (typeof onComplete === 'function') onComplete();
        }
      } else {
        setProgress((p) => p + 1);
        if (buffer < 100 && progress % 5 === 0) {
          const newBuffer = buffer + 1 + Math.random() * 10;
          setBuffer(newBuffer > 100 ? 100 : newBuffer);
        }
      }
    };
  }, [progress, buffer, onComplete]);

  React.useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      progressRef.current();
    }, 100);

    return () => clearInterval(timer);
  }, [finished]);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress
        variant="buffer"
        value={progress}
        valueBuffer={buffer}
        sx={{
          height: 8,
          '& .MuiLinearProgress-bar': { backgroundColor: '#7c3aed' },
          '& .MuiLinearProgress-bar1Buffer': { backgroundColor: '#FF3131' },
          '& .MuiLinearProgress-bar2Buffer': { backgroundColor: '#FF9999' },
        }}
      />
    </Box>
  );
}
