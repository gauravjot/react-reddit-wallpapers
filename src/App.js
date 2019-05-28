import React from 'react';
import Wallpapers from './components/wallpapers';
import Paging from './components/paging';

class App extends React.Component {

  state = {
    files: [],
    after: null,
    before: null,
    what: null,
    value: null
  }

  componentDidMount() {
    fetch('https://www.reddit.com/r/wallpapers+wallpaper+widescreenwallpaper+wqhd_wallpaper/hot.json')
    .then(res => res.json())
    .then((data) => {
      this.setState({ files: data.data.children });
      this.setState({after: data.data.after});
      this.setState({before: data.data.before})
    })
    .catch(console.log)
  }

  changePage(what, value) {
    if (what === "after") {
      fetch('https://www.reddit.com/r/wallpapers+wallpaper+widescreenwallpaper+wqhd_wallpaper/hot.json?after=' + value)
      .then(res => res.json())
      .then((data) => {
        this.setState({ files: data.data.children });
        this.setState({after: data.data.after});
        this.setState({before: data.data.before})
      })
      .catch(console.log)
    }
  }

  render () {
    return (
      <div className="container">
        <Wallpapers files={this.state.files}/>
        <Paging after={this.state.after} before={this.state.before} changePage={this.changePage.bind(this)}/>
      </div>
    );
  }

}

export default App;
