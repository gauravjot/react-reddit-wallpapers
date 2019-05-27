import React from 'react';
import Wallpapers from './components/wallpapers';

class App extends React.Component {

  state = {
      files: []
  }

  componentDidMount() {
      fetch('https://www.reddit.com/r/wallpapers/hot.json')
      .then(res => res.json())
      .then((data) => {
        this.setState({ files: data.data.children })
        console.log(data.data.children);
      })
      .catch(console.log)
    }

  render () {
    return (
      <div className="container">
        <Wallpapers files={this.state.files}/>
      </div>
    );
  }

}

export default App;
