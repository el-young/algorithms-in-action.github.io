import React, { useContext, useEffect, useState } from 'react';
import ReactMarkDown from 'react-markdown/with-html';
import toc from 'remark-toc';
import PropTypes from 'prop-types';
import CodeBlock from '../../../markdown/code-block';
import { GlobalContext } from '../../../context/GlobalState';
import { FontSizeContext } from '../../../context/FontSize';

function Explanation() {
  const { algorithm } = useContext(GlobalContext);
  const { fontSizeIncrease } = useContext(FontSizeContext);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    fetch(algorithm.explanation)
      .then((res) => res.text())
      .then((text) => setExplanation(text));
  }, [algorithm.explanation]);

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


export default Explanation;
