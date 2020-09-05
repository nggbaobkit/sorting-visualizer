import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';
import './Footer.scss';

export class Footer extends Component {
  render() {
    return (
      <div class='row footer-container align-items-center'>
        <div class='col footer-content text-center'>
          <Fade left>
            <h5>
              Copyright <i className='fa fa-copyright' /> 2020. All rights
              reserved.
            </h5>
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
    );
  }
}
