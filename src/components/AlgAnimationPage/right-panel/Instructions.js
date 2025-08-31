import React, { useContext, useEffect, useState } from 'react';
import ReactMarkDown from 'react-markdown/with-html';
import toc from 'remark-toc';

import PropTypes from 'prop-types';
import CodeBlock from '../../../markdown/code-block';
import { GlobalContext } from '../../../context/GlobalState';

function Instruction() {
  const { algorithm } = useContext(GlobalContext);
  const [explanation, setExplanation] = useState('');
  const fontID = 'textAreaExplanation';

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
    <div className="textArea" id={fontID}>
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
