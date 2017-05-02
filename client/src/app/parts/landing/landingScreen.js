import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import DocTitle from 'components/docTitle';

import cardComponent from './cardComponent';

import './landing.styl';
import Content from './content';

export default context => {
  const {tr} = context;
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
          <div className="row">
            <div className="text-center">
              <h2>
                <strong>{tr.t('Features')}</strong>
              </h2>
            </div>
          </div>
          <div className="row text-center">
            {features.map((card, key) => <CardIcon key={key} {...card} />)}
          </div>
        </section>
        <section id="gifs">
          <div className="row">
            <div className="text-center">
              <h2>
                <strong>{tr.t('End to End Testing')}</strong>
              </h2>
            </div>
          </div>
          <div className="text-center e2e-testing">
            <img
              alt="functional-testing"
              src="https://raw.githubusercontent.com/FredericHeem/gifs/master/starhackit-functional-testing.gif"
            />
          </div>
        </section>
        <section id="tech-stack-frontend">
          <div className="row">
            <div className="text-center">
              <h2>
                <strong>{tr.t('Frontend - User Interface')}</strong>
              </h2>
            </div>
          </div>
          <div className="row">
            {frontend.map((card, key) => <CardIcon key={key} {...card} />)}
          </div>
        </section>
        <section id="tech-stack-backend">
          <div className="row">
            <div className="text-center">
              <h2>
                <strong>{tr.t('Backend - API Server')}</strong>
              </h2>
            </div>
          </div>
          <div className="row">
            {backend.map((card, key) => <CardIcon key={key} {...card} />)}
          </div>
        </section>
        <section id="tech-stack-tools">
          <div className="row">
            <div className="text-center">
              <h2>
                <strong>{tr.t('Developer Tools')}</strong>
              </h2>
            </div>
          </div>
          <div className="row">
            {tools.map((card, key) => <CardIcon key={key} {...card} />)}
          </div>
        </section>
      </div>
    );
  };
};
