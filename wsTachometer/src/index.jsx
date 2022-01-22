import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import WsTachometer from "./WsTachometer";
import WsDebugger from "./WsDebugger";

class App extends React.Component {
	render () {
		return (
			<Router>
				<Switch>
          <Route exact path='/' component={WsTachometer}/>
					<Route path='/ws-debugger' component={WsDebugger}/> 
				</Switch>
			</Router>
		);
	}
}

render(<App/>, document.getElementById('app'));
