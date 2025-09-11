import React, { useContext, useEffect, useState } from 'react';
import ReactMarkDown from 'react-markdown/with-html';
import toc from 'remark-toc';
import PropTypes from 'prop-types';

import CodeBlock from '../../../markdown/code-block';
import { GlobalContext } from '../../../context/GlobalState';
import { FontSizeContext } from '../../../context/FontSize';

function Instruction() {
  const { algorithm } = useContext(GlobalContext);
  const { fontSizeIncrease } = useContext(FontSizeContext);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    let text = '# Instructions\n\n';
    algorithm.instructions.forEach((section) => {
      text += `## ${section.title}\n\n`;
      section.content.forEach((line, idx) => {
        text += `${idx + 1}. ${line}\n\n`;
      });
    });
    setExplanation(text);
  }, [algorithm.instructions]);

  return (
    <div
      className="textArea"
      style={{ fontSize: `${fontSizeIncrease}px` }}
    >
      <ReactMarkDown
        source={explanation}
        escapeHtml={false}
        renderers={{ code: CodeBlock }}
        plugins={[toc]}
      />
    </div>
  );
}

export default Instruction;
