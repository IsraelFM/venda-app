import React from 'react';
import { StyleSheet, View } from 'react-native';

import { KeyboardAvoidingView } from '../../components/keyboard-view';

export default ({ navigation }) => {

  return (
    <KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});
