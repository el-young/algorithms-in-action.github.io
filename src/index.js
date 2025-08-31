import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AlgAnimation from './components/AlgAnimationPage';
import About from './components/AboutPage';
import MainMenu from './components/MainMenuPage'

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/animation" component={AlgAnimation} />
        <Route path="/about" component={About} />
        <Route path="/" component={MainMenu} />
        <Route component={MainMenu} />
      </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(<Router />, document.getElementById('root'));