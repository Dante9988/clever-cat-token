import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar'
import Content from './Content'
import { connect } from 'react-redux';
import {
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange
} from '../store/interactions';
import { accountSelector, contractsLoadedSelector } from '../store/selectors'
import { Nav } from 'react-bootstrap';

class App extends Component {
  UNSAFE_componentWillMount() {
    this.loadBlockChainData(this.props.dispatch)
  }

  async loadBlockChainData(dispatch) {
    const web3 = loadWeb3(dispatch)
    await web3.eth.net.getNetworkType()
    const networkId = await web3.eth.net.getId()
    await loadAccount(web3, dispatch)
    const token = loadToken(web3, networkId, dispatch)
    loadExchange(web3, networkId, dispatch)
  }

  render() {
    return (
      <div>
       <Navbar />
       { 
       this.props.contractsLoaded 
       ? <Content /> : 
       <div className="content"></div>
       }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App);
