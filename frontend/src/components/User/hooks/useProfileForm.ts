import { useState, useCallback } from 'react';
import type { User } from '../../../store/user-context';
import type { UpdateUserPayload } from '../../../api/user/userApi';
import { PROFILE_CONSTANTS } from '../constants';

export interface ProfileFormData {
  name: string;
  email: string;
  homeAddress: string;
  mobilePhoneNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  driversLicenseNumber: string;
  password: string;
  confirmPassword: string;
}

export interface FormValidationError {
  field: keyof ProfileFormData;
  message: string;
}

const createInitialFormData = (user: User | null): ProfileFormData => ({
  name: user?.name || '',
  email: user?.email || '',
  homeAddress: user?.homeAddress || '',
  mobilePhoneNumber: user?.mobilePhoneNumber || '',
  vehicleType: user?.vehicleType || '',
  vehiclePlate: user?.vehiclePlate || '',
  driversLicenseNumber: user?.driversLicenseNumber || '',
  password: '',
  confirmPassword: '',
});

const validateForm = (formData: ProfileFormData): FormValidationError[] => {
  const errors: FormValidationError[] = [];

  // Name validation
  if (!formData.name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!PROFILE_CONSTANTS.VALIDATION.EMAIL_REGEX.test(formData.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Phone validation
  if (!formData.mobilePhoneNumber.trim()) {
    errors.push({ field: 'mobilePhoneNumber', message: 'Phone number is required' });
  }

  // Address validation
  if (!formData.homeAddress.trim()) {
    errors.push({ field: 'homeAddress', message: 'Address is required' });
  }

  // Password validation (only if provided)
  if (formData.password || formData.confirmPassword) {
    if (!formData.password && formData.confirmPassword) {
      errors.push({ field: 'password', message: 'Please enter a new password if you want to change it' });
    }
    if (formData.password && !formData.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Please confirm your new password' });
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }
    if (formData.password && formData.password.length < PROFILE_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH) {
      errors.push({ field: 'password', message: `Password must be at least ${PROFILE_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH} characters long` });
    }
  }

  return errors;
};

export const useProfileForm = (user: User | null) => {
  const [formData, setFormData] = useState<ProfileFormData>(() => createInitialFormData(user));
  const [errors, setErrors] = useState<FormValidationError[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const updateField = useCallback((field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    setErrors(prev => prev.filter(error => error.field !== field));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(createInitialFormData(user));
    setErrors([]);
  }, [user]);

  const startEditing = useCallback(() => {
    setIsEditing(true);
    resetForm();
  }, [resetForm]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    resetForm();
  }, [resetForm]);

  const validateAndGetUpdateData = useCallback((): { isValid: boolean; updateData?: UpdateUserPayload } => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return { isValid: false };
    }

    const updateData: UpdateUserPayload = {
      fullName: formData.name,
      email: formData.email,
      homeAddress: formData.homeAddress,
      mobilePhoneNumber: formData.mobilePhoneNumber,
      vehicleType: formData.vehicleType,
      vehiclePlate: formData.vehiclePlate,
      driversLicenseNumber: formData.driversLicenseNumber,
    };

    // Only include password if it's provided
    if (formData.password) {
      updateData.password = formData.password;
    }

    return { isValid: true, updateData };
  }, [formData]);

  const getFieldError = useCallback((field: keyof ProfileFormData): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  }, [errors]);

  return {
    formData,
    errors,
    isEditing,
    updateField,
    resetForm,
    startEditing,
    cancelEditing,
    validateAndGetUpdateData,
    getFieldError,
  };
};
