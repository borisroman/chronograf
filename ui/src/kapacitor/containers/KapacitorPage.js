import React, {PropTypes} from 'react';
import FlashMessages from 'shared/components/FlashMessages';
import {getKapacitor, createKapacitor, updateKapacitor} from 'shared/apis';
import AlertOutputs from '../components/AlertOutputs';

export const KapacitorPage = React.createClass({
  propTypes: {
    source: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  },

  getInitialState() {
    return {
      kapacitorURL: '',
      kapacitorName: '',
      kapacitorUser: '',
      validKapacitor: false,
    };
  },

  componentDidMount() {
    getKapacitor(this.props.source.id).then((res) => {
      console.log("setting state", res);
      const kapacitor = res.data;
      this.setState({
        kapacitorURL: kapacitor.url,
        kapacitorName: kapacitor.name,
        kapacitorUser: kapacitor.username,
        validKapacitor: true,
      });
    }).catch(function (error) {
      // do nothing for now
    });
  },

  handleKapacitorUpdate(e) {
    e.preventDefault();
    const kapacitor = {
      url: this.state.kapacitorURL,
      name: this.state.kapacitorName,
      username: this.state.kapacitorUser,
      password: this.kapacitorPassword.value,
    };
    console.log("handle: ", kapacitor);
    if (this.validKapacitor) {
      console.log("creating: ", kapacitor);
      createKapacitor(kapacitor).then(({data: kapacitor}) => {
        this.setState({
          validKapacitor: true,     
        });
      });      
    } else {
      updateKapacitor(kapacitor).then(({data: kapacitor}) => {
        console.log("updating: ", kapacitor);
        this.setState({
          validKapacitor: true,
        });
      });
    }
  },

  changeURL(e) {
    this.setState({
      kapacitorURL: e.target.value,
    });
  },

  changeName(e) {
    this.setState({
      kapacitorName: e.target.value,
    });
  },

  changeUser(e) {
    this.setState({
      kapacitorUser: e.target.value,
    })
  },

  render() {
    const kapacitor = {
      url: this.state.kapacitorURL,
      name: this.state.kapacitorName,
      username: this.state.kapacitorUser,
    };

    return (
      <div className="kapacitor">
        <div className="enterprise-header">
          <div className="enterprise-header__container">
            <div className="enterprise-header__left">
              <h1>
                Kapacitor Configuration
              </h1>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 col-offset-2">
              <div className="panel panel-minimal">
                <div className="panel-body">
                  <p>
                    Kapacitor is used as the monitoring and alerting agent. 
                    This page will let you configure which Kapacitor to use and 
                    set up alert end points like email, Slack, and others.
                  </p>
                </div>

                <div className="panel-body">
                  <h4 className="text-center">Kapacitor Connection Information</h4>
                  <br/>
                  <form onSubmit={this.handleKapacitorUpdate}>
                    <div>
                      <div className="form-group col-xs-6 col-sm-4 col-sm-offset-2">
                        <label htmlFor="connect-string">Connection String</label>
                        <input ref={(r) => this.kapacitorURL = r} className="form-control" id="connect-string" placeholder="http://localhost:9092" value={this.state.kapacitorURL || ''} onChange={this.changeURL}></input>
                      </div>
                      <div className="form-group col-xs-6 col-sm-4">
                        <label htmlFor="name">Name</label>
                        <input ref={(r) => this.kapacitorName = r} className="form-control" id="name" placeholder="My Kapacitor" value={this.state.kapacitorName || ''} onChange={this.changeName}></input>
                      </div>
                      <div className="form-group col-xs-6 col-sm-4 col-sm-offset-2">
                        <label htmlFor="username">Username</label>
                        <input ref={(r) => this.kapacitorUser = r} className="form-control" id="username" value={this.state.kapacitorUser || ''} onChange={this.changeUser}></input>
                      </div>
                      <div className="form-group col-xs-6 col-sm-4">
                        <label htmlFor="password">Password</label>
                        <input ref={(r) => this.kapacitorPassword = r} className="form-control" id="password" type="password"></input>
                      </div>
                    </div>

                    <div className="form-group col-xs-12 text-center">
                      <button className="btn btn-success" type="submit">&nbsp;&nbsp;Set Connection Details&nbsp;&nbsp;</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 col-offset-2">
              <AlertOutputs source={this.props.source} validKapacitor={this.state.validKapacitor} />
            </div>
          </div>
        </div>
      </div>
    );
  },

});

export default FlashMessages(KapacitorPage);
