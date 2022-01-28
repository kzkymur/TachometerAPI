import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import WsTachometer from "./WsTachometer";
import WsDebugger from "./WsDebugger";
import ArchiveDemo from "./ArchiveDemo";

class App extends React.Component {
	render () {
		return (
			<Router>
				<Switch>
          <Route exact path='/' component={WsTachometer}/>
					<Route path='/ws-debugger' component={WsDebugger}/> 
					<Route path='/archive-demo' component={ArchiveDemo}/> 
				</Switch>
			</Router>
		);
	}
}

render(<App/>, document.getElementById('app'));
