import React from 'react';
import { StyleSheet, View } from 'react-native';

import { KeyboardAvoidingView } from '../../components/keyboard-view';

export default ({ navigation }) => {

  return (
    <KeyboardAvoidingView>
      <ImageOverlay
        style={styles.container}
      // source={require('./assets/image-background.jpg')}
      >
      </ImageOverlay>
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
