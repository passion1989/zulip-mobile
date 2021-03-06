import React from 'react';
import { connect } from 'react-redux';

import boundActions from '../boundActions';
import styles from '../common/styles';
import { fetchApiKey } from '../api';
import config from '../config';
import { Screen, ErrorMsg, Button, Input } from '../common';
import { getAuth } from '../account/accountSelectors';

type Props = {};

class PasswordAuthScreen extends React.Component {

  props: Props;

  state: {
    progress: boolean,
    email: string,
    password: string,
    error: string,
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      progress: false,
      email: props.email || config.defaultLoginEmail,
      password: props.password || config.defaultLoginPassword,
    };
  }

  tryPasswordLogin = async () => {
    const { auth, loginSuccess } = this.props;
    const { email, password } = this.state;

    this.setState({ progress: true, error: undefined });

    try {
      const apiKey = await fetchApiKey(auth, email, password);
      loginSuccess(auth.realm, email, apiKey);
      this.setState({ progress: false });
    } catch (err) {
      this.setState({ progress: false, error: 'Can not login with these credentials' });
    }
  };

  validateForm = () => {
    const { email, password } = this.state;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      this.setState({ error: 'Enter a valid email' });
    } else if (!password) {
      this.setState({ error: 'Enter your password' });
    } else {
      this.tryPasswordLogin();
    }
  };

  render() {
    const { email, password, progress, error } = this.state;

    return (
      <Screen title="Email Login" keyboardAvoiding>
        <Input
          customStyle={styles.fieldMargin}
          autoCorrect={false}
          autoFocus
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email"
          defaultValue={email}
          onChangeText={newEmail => this.setState({ email: newEmail })}
        />
        <Input
          customStyle={styles.fieldMargin}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={newPassword => this.setState({ password: newPassword })}
        />
        <Button
          text="Sign in"
          progress={progress}
          onPress={this.validateForm}
        />
        <ErrorMsg error={error} />
      </Screen>
    );
  }
}

export default connect(
  (state) => ({
    auth: getAuth(state),
    email: getAuth(state).email,
    password: getAuth(state).password,
  }),
  boundActions,
)(PasswordAuthScreen);
