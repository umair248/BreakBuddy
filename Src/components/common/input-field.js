import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const InputField = ({
  label,
  placeholder,
  onChange = () => {},
  error,
  password,
  onFocus = () => {},
  isDark,
  isDisabled,
  value,
  required = false,
  icon,
  className,
  textClassName,
}) => {
  const [hidePassword, setHidePassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const borderStyle = () => {
    if (error) return styles.errorBorder;
    if (isFocused)
      return isDark ? styles.focusedDarkBorder : styles.focusedLightBorder;
    return styles.defaultBorder;
  };

  return (
    <View style={className}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          borderStyle(),
          isDisabled && styles.disabled,
        ]}>
        {icon && <View>{icon}</View>}
        <TextInput
          style={[styles.input, textClassName]}
          placeholder={placeholder}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          onChangeText={onChange}
          secureTextEntry={password && !hidePassword}
          editable={!isDisabled}
          value={value}
          required={required}
        />
        {password && (
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Icon
              name={hidePassword ? 'eye' : 'eye-slash'}
              size={20}
              color={isDark ? 'white' : 'black'}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 8,
    left: 20,
  },
  required: {
    color: '#F30000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 42,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  errorBorder: {
    borderColor: 'red',
  },
  focusedDarkBorder: {
    borderColor: '#primary-600',
  },
  focusedLightBorder: {
    borderColor: 'black',
  },
  defaultBorder: {
    borderColor: '#D8D8D8',
  },
  errorText: {
    color: 'red',
    left: 16,
    top: 5,
  },
  disabled: {
    backgroundColor: '#F5F5F5',
  },
});

export default InputField;
