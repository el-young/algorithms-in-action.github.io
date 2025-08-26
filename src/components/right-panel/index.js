import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/RightPanel.scss'
import HeaderButton from './HeaderButton'
import Explanation from './Explanation'
import Pseudocode from './Pseudocode'
import ExtraInfo from './ExtraInfo'
import Instruction from './Instructions'

export const PSEUDOCOE_INDEX    = 0;
export const BACKGROUND_INDEX   = 1;
export const MORE_INDEX         = 2;
export const INSTRUCTIONS_INDEX = 3;

function RightPanel({ fontSize, fontSizeIncrement, tab, setTab }) {
  const buttons = [
    {
      id: PSEUDOCOE_INDEX,
      label: 'Code',
      display: (
        <Pseudocode fontSize={fontSize} fontSizeIncrement={fontSizeIncrement} />
      ),
    },
    {
      id: BACKGROUND_INDEX,
      label: 'Background',
      display: (
        <Explanation
          fontSize={fontSize}
          fontSizeIncrement={fontSizeIncrement}
        />
      ),
    },
    {
      id: MORE_INDEX,
      label: 'More',
      display: (
        <ExtraInfo fontSize={fontSize} fontSizeIncrement={fontSizeIncrement} />
      ),
    },
    {
      id: INSTRUCTIONS_INDEX,
      label: 'Instructions',
      display: (
        <Instruction
          fontSize={fontSize}
          fontSizeIncrement={fontSizeIncrement}
        />
      ),
    },
  ]

  return (
    <>
      <HeaderButton
        items={buttons}
        current={tab}
        onChange={setTab}
      />
      {buttons[tab].display}
    </>
  );
}

export default RightPanel
RightPanel.propTypes = {
  fontSize: PropTypes.number.isRequired,
  fontSizeIncrement: PropTypes.number.isRequired,
  tab: PropTypes.number.isRequired,
  setTab: PropTypes.func.isRequired,
};