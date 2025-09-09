/* eslint-disable no-prototype-builtins */
/* eslint-disable import/no-named-as-default */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import ControlButton from '../../common/ControlButton';
import ProgressBar from './ProgressBar';
import useInterval from '../../../context/useInterval';
import { ReactComponent as PlayIcon } from '../../../assets/icons/play.svg';
import { ReactComponent as PauseIcon } from '../../../assets/icons/pause.svg';
import { ReactComponent as PrevIcon, ReactComponent as NextIcon } from '../../../assets/icons/arrow.svg';
import { GlobalContext } from '../../../context/GlobalState';
import { GlobalActions } from '../../../context/actions';
import '../../../styles/ControlPanel.scss';
import 'reactjs-popup/dist/index.css';

const muiTheme = createTheme({
  overrides: {
    MuiSlider: {
      thumb: {
        color: '#027AFF',
      },
      track: {
        color: '#3392FF',
      },
      rail: {
        color: '#B5B5B5',
      },
      mark: {
        color: '#F7F7F7',
      },
      markActive: {
        color: '#F7F7F7',
      },
    },
  },
});

const DEFAULT_SPEED = 50;

function ControlPanel() {
  // eslint-disable-next-line
  const { algorithm, dispatch } = useContext(GlobalContext);
  const { chunker } = algorithm;
  const currentChunk = chunker ? chunker.currentChunk : -1;
  const chunkerLength = chunker ? chunker.chunks.length : -1;

  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [playing, setPlaying] = useState(false);
  const [explanation, setExplanation] = useState('');

  const prev = (isPlaying = false) => {
    dispatch(GlobalActions.PREV_LINE, isPlaying);
  };

  const next = (isPlaying = false) => {
    dispatch(GlobalActions.NEXT_LINE, isPlaying);
  };

  const pause = () => {
    dispatch(GlobalActions.TOGGLE_PLAY, false);
    setPlaying(false);
  };

  // needs to check if there any chunks left first
  const play = () => {
    const canPlay = chunker && chunker.isValidChunk(currentChunk + 1);
    if (canPlay) {
      // dispatch(GlobalActions.TOGGLE_PLAY, true);
      // I could have used this to update the global state that the animation is playing,
      // however this means we will call two dispatches (TOGGLE_PLAY and NEXT_LINE) in a
      // very short interval, but setState() updates asynchronously, so state does not change
      // as expected.
      next(true);
      setPlaying(true);
    } else {
      pause();
    }
  };

  const handleClickPlay = () => {
    play();
  };

  /**
   * when click play button, calling play() based on the slider speed.
   * Using useInterval, play() now can read fresh states, otherwise play() will
   * stuck in the closure when this component first mount.
   * (e.g. currentChunk will always be 1)
   * @param {function} callback function that will be called in each interval
   * @param {number} delay millisecond delay between next call
   */
  useInterval(() => {
    play();
  }, playing ? 2000 - (19 * speed) : null);
  const handleSliderChange = (event, newSpeed) => {
    setSpeed(newSpeed);
  };

  // XXXTODO really do not like how step and expand have to be included
  // like this, a newer dev is not going to find this place intuitive
  // the only fix is to pass step and expand into parameter components
  // since they know exactly when LOAD_ALGORITHM is called and finished.
  // But should parameter components really be responsible for holding
  // step and expand as props? Also this would be the only way to get insertStep
  // searchStep, working, etc. for supporting the visualiser must be
  // built first issues. Expand must be applied before step
  // otherwise line highlighting of pseudocode is off, this is why
  // I do not seperate expand into the pseudocode file in right panel
  // even though it makes semantic sense to put that there and put step here
  // since we lose control over the timings.
  const expandAndStepApplied = useRef(false);
  useEffect(() => {
    if (!algorithm?.chunker || expandAndStepApplied.current) return;

    const searchParams = new URLSearchParams(window.location.search);

    const expand = searchParams.get("expand");
    if (expand) {
      try {
        const expandState = JSON.parse(expand);
        Object.entries(expandState).forEach(([modeName, blocks]) => {
          Object.entries(blocks).forEach(([blockName, shouldExpand]) => {
            dispatch(GlobalActions.COLLAPSE, {
              codeblockname: blockName,
              expandOrCollapase: shouldExpand,
            });
          });
        });
      } catch (err) {
        console.error("Invalid expand param:", expand, err);
      }
    }

    // Must apply expand before step otherwise line highlighting is wrong
    const step = searchParams.get("step");
    if (step && !isNaN(step)) {
      const stepNum = parseInt(step, 10);
      const maxStep = algorithm.chunker.chunks.length - 1;
      const clamped = Math.max(0, Math.min(stepNum, maxStep));

      // NEXT_LINE uses do-while starting at 0, step=0 starts at step 1
      if (clamped > 0) dispatch(GlobalActions.NEXT_LINE, { stopAt: clamped });
    }
    expandAndStepApplied.current = true;
}, [algorithm?.chunker]);
  
  return (
    <div className="controlContainer">
      <div className="controlPanel">
        <div className="rightControl">
          <div className="controlButtons">
            {/* Prev Button */}
            <ControlButton
              icon={<PrevIcon />}
              type="prev"
              disabled={!(chunker && chunker.isValidChunk(currentChunk - 1))}
              onClick={() => prev()}
            />
            {/* Play/Pause Button */}
            {playing ? (
              <ControlButton icon={<PauseIcon />} type="pause" onClick={() => pause()} />
            ) : (
              <ControlButton
                icon={<PlayIcon />}
                type="play"
                disabled={!(chunker && chunker.isValidChunk(currentChunk + 1))}
                onClick={handleClickPlay}
              />
            )}
            {/* Next Button */}
            <ControlButton
              icon={<NextIcon />}
              type="next"
              disabled={!(chunker && chunker.isValidChunk(currentChunk + 1))}
              onClick={() => next()}
            />
          </div>
        </div>
        {/* Speed Slider */}
        <div className="speed">
          <div className="innerSpeed">
            {/* Label the speed slider as SPEED */}
            SPEED
          </div>
        </div>
        <div className="sliderContainer">
          <div className="slider">
            <ThemeProvider theme={muiTheme}>
              <Grid container spacing={2}>
                <Grid item xs>
                  <Slider
                    value={speed}
                    onChange={handleSliderChange}
                    aria-labelledby="continuous-slider"
                  />
                </Grid>
              </Grid>
            </ThemeProvider>
          </div>
        </div>
        <div className="prcessbar">
          {/* Progress Status Bar */}
          <ProgressBar
            current={currentChunk}
            max={chunkerLength}
            state={algorithm}
            dispatch={dispatch}
          />
        </div>

      </div>
      <div className="parameterPanel">
        {algorithm.param}
      </div>
    </div>
  );
}

export default ControlPanel;
