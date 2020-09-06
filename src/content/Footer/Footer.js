import React, { Component } from 'react';
import './Footer.scss';

export class Footer extends Component {
  render() {
    return (
      <div class='row footer-container align-items-center'>
        <div class='col footer-content text-center'>
          <h5>
            Copyright <i className='fa fa-copyright' /> 2020. All rights
            reserved.
          </h5>
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
        </div>
      </div>
    );
  }
}
