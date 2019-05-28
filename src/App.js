import React from 'react';
import Wallpapers from './components/wallpapers';

class App extends React.Component {

  state = {
    url: 'https://www.reddit.com/r/wallpapers+wallpaper+widescreenwallpaper+wqhd_wallpaper/hot.json',
    files: [],
    after: null,
    before: null
  }

  componentDidMount() {
    fetch(this.state.url)
    .then(res => res.json())
    .then((data) => {
      this.setState({files: data.data.children});
      this.setState({after: data.data.after});
      this.setState({before: data.data.before});
    })
    .catch(console.log)
  }

  nextPage() {
      fetch(this.state.url + "?after=" + this.state.after)
      .then(res => res.json())
      .then((data) => {
        this.setState({files: data.data.children});
        this.setState({after: data.data.after});
        this.setState({before: data.data.before});
      })
      .catch(console.log)
  }

  prevPage() {
    fetch(this.state.url + "?before=" + this.state.before)
    .then(res => res.json())
    .then((data) => {
      this.setState({files: data.data.children});
      this.setState({after: data.data.after});
      this.setState({before: data.data.before})
    })
    .catch(console.log)
}

  render () {
    let pagingJSX;
    const buttonNext = <input className="btn btn-primary" type="submit" value="Next" onClick={this.nextPage}/>;
    const buttonPrev = <input className="btn btn-primary" type="submit" value="Next" onClick={this.prevPage}/>;
    if (this.props.before != null && this.props.after != null) {
        // in between pages
        pagingJSX = <div>{buttonPrev} {buttonNext}</div>;
    } else if (this.props.before == null && this.props.after != null) {
        // first page
        pagingJSX = <div>{buttonNext}</div>;
    } else {
        // last page
        pagingJSX = <div>{buttonPrev}</div>;
    }

    return (
      <div className="container">
        <Wallpapers files={this.state.files}/>
        <div class="center">{pagingJSX}</div>
      </div>
    );
  }

}

export default App;
