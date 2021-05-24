import { Component } from 'react';

export default class PlayerSelectModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      index: 0
    }
  }

  render() {
    return (
      <div style={{width: "500px", height: "200px", backgroundColor: "red"}}>
      </div>
    );
  }
}
