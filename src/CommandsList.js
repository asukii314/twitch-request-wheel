import { Component } from 'react';
import YAML from 'yaml'
import rawCommandsList from './Commands.yaml';
import './CommandsList.css';
import {Nav, Table} from 'react-bootstrap';
const fetch = require('node-fetch');


export const SectionTable = function (data, i) {
    // console.log('SectionTable:', data);
    let {entries} = data;
    return (
        <Table striped bordered hover variant="dark" responsive="lg" key={`command-table-row-${i}`} className="mb-0">
            {/* <caption>{section}</caption> */}
            <thead>
                <tr className="text-center align-middle">
                    <th width="10%">Command</th>
                    <th width="10%">Permissions</th>
                    <th width="40%">Description</th>
                    <th width="20%">On Screen Equivalent</th>
                    <th width="10%">Variants</th>
                    <th width="10%">Example</th>
                </tr>
            </thead>
            <tbody className="table-group-divider">
                {!!entries && entries.map(CommandTableRow)}
            </tbody>
        </Table>

    );
}
export const CommandTableRow = function ({command, info}, i) {
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

export default class CommandsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeFilter: null,
            validCommands: []
        };
    }

    componentDidMount(props) {
        fetch(rawCommandsList)
            .then(r => r.text())
            .then(text => {
                let validCommands = YAML.parse(text);
                this.setState((state) => {
                    return {
                        ...state,
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

    onSelectTab = (eventKey) => {
        switch (eventKey) {
            case 'All Commands':
                return this.setState({
                    activeFilter: null
                });
            default:
                return this.setState({
                    activeFilter: eventKey
                });
        }
    }

    render() {
        const {validCommands} = this.state;

        let navItems = [
            {section: 'All Commands'},
            ...validCommands
        ].map(cmd => {
            const {section} = cmd;
            return (
                <Nav.Item key={section}>
                    <Nav.Link eventKey={section} data-testid={section}>
                        {section}
                    </Nav.Link>
                </Nav.Item>
            );
        });

        return (
            <div id="commands-list" className="container">
                <h1 className="fw-bolder pt-3">Chat Commands</h1>
                <Nav variant="tabs" activeKey={this.state.activeFilter || 'All Commands'} onSelect={this.onSelectTab}>
                    {/* <Nav.Item>
                        <Nav.Link eventKey="All Commands" data-testid="All Commands">All Commands</Nav.Link>
                    </Nav.Item> */}
                    {validCommands.length > 0 && navItems}
                </Nav>
                <div className="col-12 px-3 pb-1 mb-3 text-start commands-table-wrapper">
                    {!!validCommands && validCommands.map(
                        (data, i) => {
                            let {activeFilter} = this.state;
                            if (activeFilter && activeFilter !== data.section) {
                                return null;
                            }
                            return (
                                <div key={`section-${i}`}>
                                    <h4 className="px-1 pt-3 fw-bolder" key={`section-table-row-${i}`}>
                                        {data.section}
                                    </h4>
                                    {SectionTable(data)}
                                </div>
                            );
                        }
                    ).filter(cmd => cmd)}
                </div>
            </div>
        );
    }
}