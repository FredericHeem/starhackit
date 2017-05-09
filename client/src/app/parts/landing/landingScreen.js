import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import DocTitle from 'components/docTitle';
import Row from 'components/Row';
import Title from 'components/Title';
import cardComponent from './cardComponent';

import './landing.styl';
import Content from './content';

export default context => {
  const { tr } = context;
  const CardIcon = cardComponent(context);
  const { features, frontend, backend, tools } = Content();

  return function landingScreen() {
    return (
      <div id="main-landing" className="text-center">
        <DocTitle title="Home" />

        <section className="header-container">
          <div className="header clearfix">
            <div className="text-vertical-center">
              <h1>{tr.t('StarHackIt')}</h1>
              <h2>{tr.t('A Full Stack Web Application Starter Kit')}</h2>
              <h3>{tr.t('Built with React, Node, data backed by SQL')}</h3>
              <br />

              <RaisedButton
                label="Clone the code on GitHub"
                href="https://github.com/FredericHeem/starhackit"
                icon={<FontIcon className="icon-github-circled-alt2" />}
              />
            </div>
          </div>
        </section>

        <section id="start">
          <Row>
            <Title>
              {tr.t('Features')}
            </Title>
          </Row>
          <Row className="text-center">
            {features.map((card, key) => <CardIcon key={key} {...card} />)}
          </Row>
        </section>
        <section id="gifs">
          <Row>
            <Title>
              {tr.t('End to End Testing')}
            </Title>
          </Row>
          <div className="text-center e2e-testing">
            <img
              alt="functional-testing"
              src="https://raw.githubusercontent.com/FredericHeem/gifs/master/starhackit-functional-testing.gif"
            />
          </div>
        </section>
        <section id="tech-stack-frontend">
          <Row>
            <Title>
              {tr.t('Frontend - User Interface')}
            </Title>
          </Row>
          <Row>
            {frontend.map((card, key) => <CardIcon key={key} {...card} />)}
          </Row>
        </section>
        <section id="tech-stack-backend">
          <Row>
            <Title>
              {tr.t('Backend - API Server')}
            </Title>
          </Row>
          <Row>
            {backend.map((card, key) => <CardIcon key={key} {...card} />)}
          </Row>
        </section>
        <section id="tech-stack-tools">
          <Row>
            <Title>
              {tr.t('Developer Tools')}
            </Title>
          </Row>
          <Row>
            {tools.map((card, key) => <CardIcon key={key} {...card} />)}
          </Row>
        </section>
      </div>
    );
  };
};
