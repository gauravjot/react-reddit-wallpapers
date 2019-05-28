import React, { Component } from 'react';

class Paging extends Component {

    constructor() {
        super();
        this.changePage = this.changePage.bind(this);
      }

    changePage() {
        this.props.changePage("after", this.props.after);
    }

    render() {
        let jsx;
        if (this.props.before != null && this.props.after != null) {
            // in between pages
            jsx = <div>Prev | Next</div>;
        } else if (this.props.before == null && this.props.after != null) {
            // first page
            jsx = <div><input className="btn btn-primary" type="submit" value="Next" onClick={this.changePage}/></div>;
        } else {
            // last page
            jsx = <div>Prev</div>;
        }
        return <div class="center">{jsx}</div>;
    }
}

export default Paging;