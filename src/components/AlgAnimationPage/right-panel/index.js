import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import '../../../styles/RightPanel.scss'
import HeaderButton from './HeaderButton'
import Explanation from './Explanation'
import Pseudocode from './Pseudocode'
import ExtraInfo from './ExtraInfo'
import Instruction from './Instructions'
import { GlobalContext } from '../../../context/GlobalState'

function RightPanel() {
  const { algorithm } = useContext(GlobalContext);

  const buttons = [
  { id: 0, label: 'Code', display: algorithm?.pseudocode ? <Pseudocode /> : null },
  { id: 1, label: 'Background', display: algorithm?.explanation ? <Explanation /> : null },
  { id: 2, label: 'More', display: algorithm?.extraInfo ? <ExtraInfo /> : null },
  { id: 3, label: 'Instructions', display: algorithm?.instructions ? <Instruction /> : null },
];

  const [state, setState] = useState(0)

  return (
    <>
      <HeaderButton value={buttons} onChange={setState} />
      {buttons[state].display}
    </>
  )
}

export default RightPanel
