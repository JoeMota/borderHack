import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Header />
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <div className="site-layout-content">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </Content>
        <Footer />
      </Layout>
    </Router>
  );
}

export default App;