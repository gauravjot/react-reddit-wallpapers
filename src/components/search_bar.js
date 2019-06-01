import React from 'react';

class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            term: ''
        }
    }

    render() {
    return (
        <div className="m-2">
            <div className="input-group mb-2">
                <div className="input-group-prepend">
                    <div className="input-group-text">r/</div>
                </div>
                <input type="text" className="form-control" onChange={event => this.search(event.target.value)} value={this.state.term} name="search" placeholder="wallpapers"/>
            </div>
        </div>
    );
    }

    search(term) {
        this.setState({term});
        this.props.onSearchTermChange(term);
    }
}

export default SearchBar;