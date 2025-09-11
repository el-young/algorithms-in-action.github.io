/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { withStyles } from "@mui/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import PropTypes from "prop-types";
import { GlobalActions } from "../../context/actions";
import { GlobalContext } from "../../context/GlobalState";
import { errorParamMsg } from "./helpers/ParamMsg";
import ParamFormRefresh from "./helpers/ParamFormRefresh";
import ParamForm from "./helpers/ParamForm";
import "../../styles/Param.scss";
import { ERRORS, EXAMPLES } from "./helpers/ErrorExampleStrings";
import { dualValueParamValidCheck } from "./helpers/InputValidators";

const BlueRadio = withStyles({
  root: {
    color: "#2289ff",
    "&$checked": {
      color: "#027aff",
    },
  },
  checked: {},
})((props) => <Radio {...props} />);

const UNION = "union";
const FIND = "find";
const N_ARRAY = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const defaultProps = {
  mode: UNION,
  union: "1-2,3-4,2-4,1-5,6-8,3-6",
  value: "2",
  compress: true,
};

function UFParam({
  alg,
  mode : urlMode,
  union: urlUnion,
  value: urlValue,
  compress,
}) {
  const { algorithm, dispatch } = useContext(GlobalContext);

  const [ unions, setUnions ] = useState(urlUnion || defaultProps.union);
  const [ value, setValue ]   = useState(urlValue || defaultProps.value);
  const [ mode, setMode ]     = useState(urlMode  || defaultProps.mode);
  const [ isPathCompression, setIsPathCompression ] = useState(
    compress === "true"
      ? true
      : compress === "false"
      ? false
      : defaultProps.compress
  );
  const [ message, setMessage ] = useState(null);

  useEffect(() => {
    const { valid, errors } = validateAll();

    if (valid) {
      if (mode === UNION) {
        dispatch(GlobalActions.LOAD_ALGORITHM, {
          name: alg,
          mode: UNION,

          url: {
            alg,
            mode: UNION,
            union: unions,
            value,
            compress: isPathCompression.toString(),
          },

          target: {
            arg1: unions
              .split(",")
              .map((pair) => pair.trim().split("-").map(Number)),
            arg2: isPathCompression,
          },
        });
      } else {
        dispatch(GlobalActions.LOAD_ALGORITHM, {
          name: alg,
          mode: FIND,
          visualiser: algorithm?.chunker?.visualisers,

          url: {
            alg,
            mode: FIND,
            union: unions,
            value,
            compress: isPathCompression.toString(),
          },

          target: {
            arg1: parseInt(value, 10),
            arg2: isPathCompression,
          },
        });
      }
      setMessage(null);
    } else {
      setMessage(errorParamMsg(errors.join("\n")));
    }
  }, [unions, value, isPathCompression, mode]);

  const validateAll = () => {
    const errors = [];

    if (mode === UNION) {
      const { valid, error } = dualValueParamValidCheck(unions, "Union field", N_ARRAY);
      if (!valid) errors.push(`${error}\n${EXAMPLES.UF_UNION}`);
    }

    if (mode === FIND) {
      const num = parseInt(value, 10);

      if (Number.isNaN(num)) {
        errors.push(
          `${ERRORS.GEN_ONLY_POSITIVE_INTEGERS("find value field")}\n${EXAMPLES.UF_FIND}`
        );
      } else if (!N_ARRAY.includes(value)) {
        errors.push(
          `${ERRORS.GEN_NUMBER_NOT_IN_DOMAIN("find value field")}\n${EXAMPLES.UF_FIND}`
        );
      } else if (!algorithm?.visualisers) {
        errors.push(
          ERRORS.GEN_BUILD_VISUALISER_FIRST("union find array", UNION)
        );
      }
    }

    return { valid: errors.length === 0, errors };
  };

  return (
    <>
      <div className="form">
        <ParamFormRefresh
          buttonName="Union"
          formClassName="formLeft"
          value={unions}
          setValue={(val) => {
            setUnions(val.replace(/\s+/g, ""));
            setMode(UNION);
          }}
          refreshFunction={() => defaultProps.union}
        />

        <ParamForm
          buttonName="Find"
          formClassName="formRight"
          value={value}
          setValue={(val) => {
            setValue(val);
            setMode(FIND);
          }}
        />
      </div>

      <span className="generalText">Path compression: &nbsp;&nbsp;</span>
      <FormControlLabel
        control={
          <BlueRadio
            checked={isPathCompression}
            onChange={() => setIsPathCompression(true)}
            name="on"
          />
        }
        label="On"
        className="checkbox"
      />
      <FormControlLabel
        control={
          <BlueRadio
            checked={!isPathCompression}
            onChange={() => setIsPathCompression(false)}
            name="off"
          />
        }
        label="Off"
        className="checkbox"
      />

      {message}
    </>
  );
}

UFParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string,
  union: PropTypes.string,
  value: PropTypes.string,
  compress: PropTypes.string,
};

export default UFParam;