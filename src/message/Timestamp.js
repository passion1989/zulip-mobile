import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import { shortTime } from '../utils/date';

const styles = StyleSheet.create({
  time: {
    color: '#999',
    fontSize: 15,
  },
});

export default class Timestamp extends React.PureComponent {

  props: {
    timestamp: number,
    twentyFourHourTime: bool,
  }

  render() {
    const { timestamp, twentyFourHourTime } = this.props;
    return (
      <Text style={styles.time}>
        {shortTime(timestamp * 1000, twentyFourHourTime)}
      </Text>
    );
  }
}
