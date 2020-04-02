import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';
import './Footer.scss';

export default class Footer extends Component {
  render() {
    return (
      <div>
        <div className='footer-container'>
          <div className='footer-content'>
            <Fade left>
              <h4>
                Copyright <i className='fa fa-copyright' /> 2018. All rights
                reserved.
              </h4>
            </Fade>
            <Fade right>
              <div>
                <span>
                  Made with{' '}
                  <span>
                    <i className='fa fa-heart' style={{ color: 'red' }} />
                  </span>{' '}
                  by{' '}
                  <a
                    href='//github.com/nggbaobkit/sorting-visualizer'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-weight-bold'
                  >
                    nggbao <i className='fa fa-external-link' />
                  </a>
                </span>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    );
  }
}
