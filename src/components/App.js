import React from 'react';
import Wallpapers from './wallpapers';

class App extends React.Component {
    
  state = {
    url: 'https://www.reddit.com/r/',
    subreddit: 'wallpapers+wallpaper+widescreenwallpaper+wqhd_wallpaper',
    sort: '/hot',
    allSubreddit: 'wallpapers+wallpaper+widescreenwallpaper+wqhd_wallpaper',
    subreddits: ['wallpaper','wallpapers','widescreenwallpaper','wqhd_wallpaper'],
    files: [],
    after: null,
    before: null,
    page: 1
  };

  componentDidMount() {
    fetch(this.state.url + this.state.subreddit + this.state.sort + '.json')
    .then(res => res.json())
    .then((data) => {
      this.setState({files: data.data.children});
      this.setState({after: data.data.after});
      this.setState({before: data.data.before});
    })
    .catch(console.log)
  }

  nextPage = ()=> {
      fetch(this.state.url + this.state.subreddit + this.state.sort + ".json?count="+ (this.state.page * 25) +"&after=" + this.state.after)
      .then(res => res.json())
      .then((data) => {
        this.setState({files: data.data.children});
        this.setState({after: data.data.after});
        this.setState({before: data.data.before});
        this.setState({page: this.state.page + 1});
      })
      .catch(console.log)
  }

  prevPage = ()=> {
    fetch(this.state.url + this.state.subreddit + this.state.sort + ".json?count="+ (((this.state.page - 1) * 25) - 1) +"&before=" + this.state.before)
    .then(res => res.json())
    .then((data) => {
      this.setState({files: data.data.children});
      this.setState({after: data.data.after});
      this.setState({before: data.data.before});
      if (this.state.page > 1) {
        this.setState({page: this.state.page - 1});
      }
    })
    .catch(console.log)
  }

  changeSubreddit(sub) {
    this.setState({subreddit: sub});
    fetch(this.state.url + sub + this.state.sort + '.json')
    .then(res => res.json())
    .then((data) => {
      this.setState({files: data.data.children});
      this.setState({after: data.data.after});
      this.setState({before: data.data.before});
    })
    .catch(console.log)
  }

  render () {
    let contentJSX;
    if (this.state.files.length > 0) {
      let pagingJSX;
      const buttonNext = <button className="btn btn-secondary" type="submit" onClick={this.nextPage}>Next</button>;
      const buttonPrev = <button className="btn btn-secondary" type="submit" onClick={this.prevPage}>Previous</button>;
      if (this.state.after === null) {
          // last page
          pagingJSX = <div>{buttonPrev}</div>;
      } else if (this.state.before === null) {
          // first page
          pagingJSX = <div>{buttonNext}</div>;
      } else {
          // in between pages
          pagingJSX = <div>{buttonPrev} <span className="p-3 text-black-50">Page {this.state.page}</span> {buttonNext}</div>;
      }
      contentJSX = <div className="m-2"><Wallpapers files={this.state.files}/><br/><div className="center-block m-2">{pagingJSX}</div></div>;
    } else {
      contentJSX = 'Loading...'
    }

    return (
      <div className="container">
        <br/>
        <div className="dropdown m-2">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            r/{this.state.subreddit}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#subChange" onClick={() => this.changeSubreddit(this.state.allSubreddit)}>All Below</a>
            {this.state.subreddits.map((subreddit, index) => (
              <a className="dropdown-item" key={index} href="#subChange" onClick={() => this.changeSubreddit(subreddit)}>r/{subreddit}</a>
            ))}
          </div>
        </div>
        <br/>
        {contentJSX}
        <br/>
      </div>
    );
  }

}

export default App;
