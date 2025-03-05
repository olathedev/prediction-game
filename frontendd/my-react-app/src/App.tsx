import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TimeOver from './components/TimeOver';
import InfoScreen from './components/InfoScreen';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={InfoScreen} />
        <Route path="/time-over" component={TimeOver} />
      </Switch>
    </Router>
  );
};

export default App;