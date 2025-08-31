import React from 'react'
import PropTypes from 'prop-types'
import '../../../styles/RightPanel.scss'
import HeaderButton from './HeaderButton'
import Explanation from './Explanation'
import Pseudocode from './Pseudocode'
import ExtraInfo from './ExtraInfo'
import Instruction from './Instructions'

function RightPanel() {
  const buttons = [
    { id: 0, label: 'Code', display: <Pseudocode /> },
    { id: 1, label: 'Background', display: <Explanation /> },
    { id: 2, label: 'More', display: <ExtraInfo /> },
    { id: 3, label: 'Instructions', display: <Instruction /> },
  ]

  const [state, setState] = React.useState(0)

  return (
    <>
      <HeaderButton value={buttons} onChange={setState} />
      {buttons[state].display}
    </>
  )
}

export default RightPanel
