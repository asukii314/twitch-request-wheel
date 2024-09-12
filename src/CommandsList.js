import { Component } from 'react';
import YAML from 'yaml'
import rawCommandsList from './Commands.yaml';
import './CommandsList.css';
import Table from 'react-bootstrap/Table';
const fetch = require('node-fetch');

const CommandTableRow = function ({command, info}, i) {
    const {
        Example,
        Availability,
        Description,
        OnScreenEquivalent,
        Variants,
    } = info;

    return (
      <tr key={`command-table-row-${i}`} className="small">
        <td className="command-name fw-semibold fs-6 text-primary-emphasis">!{command}</td>
        <td className="text-center">{Availability}</td>
        <td>{Description}</td>
        <td>{OnScreenEquivalent}</td>
        <td className={Variants==='n/a' ? null : 'font-monospace fst-italic'}>{Variants}</td>
        <td className="font-monospace fst-italic">{Example}</td>
      </tr>
    );
}

const SectionTable = function (data, i) {
    console.log('SectionTable:', data);
    let {entries/*, section*/} = data;
    return (
        <Table striped bordered hover variant="dark" key={`command-table-row-${i}`} className="caption-top">
            {/* <caption>{section}</caption> */}
            <thead class="table-group-divider">
                <tr className="text-center">
                    <th width="10%">Command</th>
                    <th width="10%">Permissions</th>
                    <th width="40%">Description</th>
                    <th width="20%">On Screen Equivalent</th>
                    <th width="10%">Variants</th>
                    <th width="10%">Example</th>
                </tr>
            </thead>
            <tbody>
                {!!entries && entries.map(CommandTableRow)}
            </tbody>
        </Table>

    );
}

export default class CommandsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validCommands: []
        };
    }

    componentDidMount(props) {
        fetch(rawCommandsList)
            .then(r => r.text())
            .then(text => {
                let validCommands = YAML.parse(text);
                // console.log('validCommands:', JSON.stringify(validCommands));
                this.setState((state) => {
                    return {
                        ...state,
                        validCommandsBackup: Object.entries(validCommands).map(([command, info], i) => ({command, info})),
                        validCommands: Object.entries(validCommands).map(
                            ([section, commands], i) => {
                                return {
                                    section,
                                    commands,
                                    entries: Object.entries(commands).map(([command, info], i) => ({command, info})),
                                };
                            }
                        )
                    };
                });
            });
    }

    render() {
        // const commandsList = Object.keys(this.state.validCommands);
        const {validCommands} = this.state;
        // Object.entries(this.state.validCommands).map(([key, value], i) => {return {key, value}})
        return (
            <div className="commands-list container text-start">
                {!!validCommands && validCommands.map(
                    (data, i) => {
                        return (
                            <div key={`section-${i}`}>
                                <h5 key={`section-table-row-${i}`}>
                                    {data.section}
                                </h5>
                                {SectionTable(data)}
                            </div>
                        );
                    }
                )}
            </div>
        );
    }
}