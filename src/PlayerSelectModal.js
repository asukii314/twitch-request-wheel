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
      <div style={{margin: '0px 15px 7px', height: "500px", padding: '4px', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "red"}}>
      </div>
    );
  }
}
