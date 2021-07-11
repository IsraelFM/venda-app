import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Layout, Modal, Text } from '@ui-kitten/components';

export const ConfirmModal = (props) => {
  const {
    onGotItButtonPress,
    onCancelItButtonPress,
    description,
    title,
    elements = null,
    buttonConfirmText = 'CONFIRMAR',
    ...modalProps
  } = props;

  return (
    <Modal
      backdropStyle={styles.backdrop}
      {...modalProps}
    >
      <Layout style={styles.container}>
        {title && (
          <Text category='h4'>
            {title}
          </Text>
        )}
        {description && (
          <Text
            style={styles.description}
            appearance='hint'
            category='s1'
          >
            {description}
          </Text>
        )}
        {elements && (
          <Layout style={styles.elements}>
            {elements}
          </Layout>
        )}
        <Layout style={styles.buttons}>
          <Button
            style={styles.cancelButton}
            status={'control'}
            onPress={onCancelItButtonPress}
          >
            CANCELAR
          </Button>
          <Button
            style={styles.confirmButton}
            onPress={onGotItButtonPress}
          >
            {buttonConfirmText}
          </Button>
        </Layout>
      </Layout>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    padding: 16,
    width: 320,
  },
  description: {
    marginTop: 8,
    marginBottom: 24,
  },
  elements: {
    marginTop: 8,
    marginBottom: 24,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});
