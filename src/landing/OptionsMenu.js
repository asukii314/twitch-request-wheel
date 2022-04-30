import {Component} from 'react';
import {Offcanvas} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {version} from '../../package.json';

import './OptionsMenu.css';

export default class OptionsMenu extends Component {
    static get propTypes() {
        return {
            onHide: PropTypes.func,
            showOptionsMenu: PropTypes.bool
        };
    }
    static get defaultProps() {
        return {
            onHide: () => void 0,
            showOptionsMenu: false
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }
    }


    render() {

        return (
            <Offcanvas
                id="options-menu"
                onHide={this.props.onHide}
                placement="end"
                show={this.props.showOptionsMenu}>
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title as="h2" className="fw-bold">
                        Options
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ul className="options-menu-items list-unstyled pb-3 px-4">
                        <li className="mb-1 fs-4 d-grid text-start">
                            <button
                                className="btn logout"
                                onClick={this.props.onLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>

                    <div className="position-absolute bottom-0 start-50 translate-middle-x pb-3">
                        <small>{`version ${version}`}</small>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        );
    }
}
