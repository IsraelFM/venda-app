import React from 'react';
import { Text, View } from 'react-native';
import { Input, StyleService, useStyleSheet } from '@ui-kitten/components';

const InputWithError = ({
  flags,
  ...inputProps
}) => {
  const styles = useStyleSheet(themedStyles);
  console.log(flags);
  const { touched = null, error = null } = flags || {};

  return (
    <>
      <Input
        style={[!!inputProps.style && inputProps.style.input]}        
        {...inputProps}
      />
      {!!touched && !!error && <Text style={styles.errorInput}>{error}</Text>}
    </>
  );
};

const themedStyles = StyleService.create({
  errorInput: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'color-danger-600',
  },
});

export default InputWithError;
