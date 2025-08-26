import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

function HeaderButton({ items, current, onChange }) {
  const handleChange = (_, newValue) => onChange(newValue);

  const globalTheme = createTheme({ palette: { primary: { main: "#027AFF" } } });
  const tabHeight = "42px";
  const useStyles = makeStyles(() => ({
    tabsRoot: { minHeight: tabHeight, height: tabHeight, width: "100%" },
    tabRoot: { minHeight: tabHeight, height: tabHeight, width: "30px" },
  }));
  const classes = useStyles();

  return (
    <ThemeProvider theme={globalTheme}>
      <Paper square elevation={0} className="rightPanelButtons">
        <Tabs
          value={current}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          aria-label="tabs button"
          classes={{ root: classes.tabsRoot }}
        >
          {items.map((item) => (
            <Tab
              key={item.id}
              label={item.label}
              disableRipple
              value={item.id}
              classes={{ root: classes.tabRoot }}
            />
          ))}
        </Tabs>
      </Paper>
    </ThemeProvider>
  );
}

export default HeaderButton;
HeaderButton.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    display: PropTypes.element.isRequired,
  })).isRequired,
  current: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
