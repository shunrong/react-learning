import {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import styles from './Form.module.css';

interface BaseFieldProps {
  label?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  success?: string;
  className?: string;
}

interface InputFieldProps
  extends BaseFieldProps,
    InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
}

interface TextareaFieldProps
  extends BaseFieldProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {}

interface SelectFieldProps
  extends BaseFieldProps,
    SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

interface CheckboxFieldProps
  extends BaseFieldProps,
    InputHTMLAttributes<HTMLInputElement> {
  type: 'checkbox';
}

interface RadioGroupProps extends BaseFieldProps {
  name: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
}

// 输入框组件
export function InputField({
  label,
  required,
  helpText,
  error,
  success,
  className = '',
  type = 'text',
  ...props
}: InputFieldProps) {
  const inputClasses = [
    styles.input,
    error && styles.inputError,
    success && styles.inputSuccess,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={`${styles.label} ${required ? styles.required : ''}`}>
          {label}
        </label>
      )}
      <input type={type} className={inputClasses} {...props} />
      {helpText && !error && !success && (
        <p className={styles.helpText}>{helpText}</p>
      )}
      {error && (
        <p className={styles.errorText}>
          <AlertCircle className={styles.errorIcon} />
          {error}
        </p>
      )}
      {success && (
        <p className={styles.successText}>
          <CheckCircle className={styles.successIcon} />
          {success}
        </p>
      )}
    </div>
  );
}

// 文本域组件
export function TextareaField({
  label,
  required,
  helpText,
  error,
  success,
  className = '',
  ...props
}: TextareaFieldProps) {
  const textareaClasses = [
    styles.input,
    styles.textarea,
    error && styles.inputError,
    success && styles.inputSuccess,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={`${styles.label} ${required ? styles.required : ''}`}>
          {label}
        </label>
      )}
      <textarea className={textareaClasses} {...props} />
      {helpText && !error && !success && (
        <p className={styles.helpText}>{helpText}</p>
      )}
      {error && (
        <p className={styles.errorText}>
          <AlertCircle className={styles.errorIcon} />
          {error}
        </p>
      )}
      {success && (
        <p className={styles.successText}>
          <CheckCircle className={styles.successIcon} />
          {success}
        </p>
      )}
    </div>
  );
}

// 选择框组件
export function SelectField({
  label,
  required,
  helpText,
  error,
  success,
  options,
  className = '',
  ...props
}: SelectFieldProps) {
  const selectClasses = [
    styles.input,
    styles.select,
    error && styles.inputError,
    success && styles.inputSuccess,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={`${styles.label} ${required ? styles.required : ''}`}>
          {label}
        </label>
      )}
      <select className={selectClasses} {...props}>
        <option value=''>请选择...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && !error && !success && (
        <p className={styles.helpText}>{helpText}</p>
      )}
      {error && (
        <p className={styles.errorText}>
          <AlertCircle className={styles.errorIcon} />
          {error}
        </p>
      )}
      {success && (
        <p className={styles.successText}>
          <CheckCircle className={styles.successIcon} />
          {success}
        </p>
      )}
    </div>
  );
}

// 复选框组件
export function CheckboxField({
  label,
  required,
  helpText,
  error,
  success,
  className = '',
  ...props
}: CheckboxFieldProps) {
  return (
    <div className={styles.formGroup}>
      <div className={styles.checkboxItem}>
        <input
          type='checkbox'
          className={`${styles.checkbox} ${className}`}
          {...props}
        />
        {label && (
          <label
            className={`${styles.checkboxLabel} ${required ? styles.required : ''}`}
          >
            {label}
          </label>
        )}
      </div>
      {helpText && !error && !success && (
        <p className={styles.helpText}>{helpText}</p>
      )}
      {error && (
        <p className={styles.errorText}>
          <AlertCircle className={styles.errorIcon} />
          {error}
        </p>
      )}
      {success && (
        <p className={styles.successText}>
          <CheckCircle className={styles.successIcon} />
          {success}
        </p>
      )}
    </div>
  );
}

// 单选按钮组组件
export function RadioGroup({
  label,
  required,
  helpText,
  error,
  success,
  name,
  options,
  value,
  onChange,
}: RadioGroupProps) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={`${styles.label} ${required ? styles.required : ''}`}>
          {label}
        </label>
      )}
      <div className={styles.radioGroup}>
        {options.map(option => (
          <div key={option.value} className={styles.radioItem}>
            <input
              type='radio'
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={e => onChange?.(e.target.value)}
              className={styles.radio}
            />
            <label className={styles.radioLabel}>{option.label}</label>
          </div>
        ))}
      </div>
      {helpText && !error && !success && (
        <p className={styles.helpText}>{helpText}</p>
      )}
      {error && (
        <p className={styles.errorText}>
          <AlertCircle className={styles.errorIcon} />
          {error}
        </p>
      )}
      {success && (
        <p className={styles.successText}>
          <CheckCircle className={styles.successIcon} />
          {success}
        </p>
      )}
    </div>
  );
}
