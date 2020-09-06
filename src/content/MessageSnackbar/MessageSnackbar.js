import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export class MessageSnackbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  componentWillReceiveProps(nextProps, nextContents) {
    this.setState({ open: nextProps.open });
  }

  handleCloseSnackbar = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={this.state.open}
          autoHideDuration={2000}
          onClose={this.handleCloseSnackbar}
        >
          <Alert onClose={this.handleCloseSnackbar} severity="error">
            Array is already sorted!
          </Alert>
        </Snackbar>
      </div>
    );
  }
}
