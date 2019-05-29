import React from 'react';
import Wallpapers from './wallpapers';

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

  nextPage = ()=> {
      fetch(this.state.url + "?count=25&after=" + this.state.after)
      .then(res => res.json())
      .then((data) => {
        this.setState({files: data.data.children});
        this.setState({after: data.data.after});
        this.setState({before: data.data.before});
      })
      .catch(console.log)
  }

  prevPage = ()=> {
    fetch(this.state.url + "?count=25&before=" + this.state.before)
    .then(res => res.json())
    .then((data) => {
      this.setState({files: data.data.children});
      this.setState({after: data.data.after});
      this.setState({before: data.data.before});
    })
    .catch(console.log)
  }

  render () {
    let pagingJSX;
    const buttonNext = <input className="btn btn-primary" type="submit" value="Next" onClick={this.nextPage}/>;
    const buttonPrev = <input className="btn btn-primary" type="submit" value="Prev" onClick={this.prevPage}/>;
        console.log(this.state.after);
        console.log(this.state.before);
    if (this.state.after === null) {
        // last page
        pagingJSX = <div>{buttonPrev}</div>;
    } else if (this.state.before === null) {
        // first page
        pagingJSX = <div>{buttonNext}</div>;
    } else {
        // in between pages
        pagingJSX = <div>{buttonPrev} {buttonNext}</div>;
    }

    return (
      <div className="container">
        <Wallpapers files={this.state.files}/>
        <div className="center">{pagingJSX}</div>
      </div>
    );
  }

}

export default App;
