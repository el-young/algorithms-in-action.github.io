import React, { useContext, useEffect, useState } from 'react';
import ReactMarkDown from 'react-markdown/with-html';
import toc from 'remark-toc';
import PropTypes from 'prop-types';

import CodeBlock from '../../../markdown/code-block';
import { GlobalContext } from '../../../context/GlobalState';

function MoreInfo() {
  const { algorithm } = useContext(GlobalContext);
  const [explanation, setExplanation] = useState('');
  const fontID = 'textAreaExtra';

  useEffect(() => {
    fetch(algorithm.extraInfo).then((res) => res.text()).then((text) => setExplanation(text));
  }, [algorithm.extraInfo]);

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

export default MoreInfo;
