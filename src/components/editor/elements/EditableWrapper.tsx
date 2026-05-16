"use client";

import React, { useState, useRef, useEffect } from 'react';

interface EditableWrapperProps {
  value: string;
  onSave: (val: string) => void;
  children: (isEditing: boolean, props: any) => React.ReactNode;
  multiline?: boolean;
}

export const EditableWrapper = ({ value, onSave, children, multiline = false }: EditableWrapperProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) onSave(tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (!multiline || !e.shiftKey)) {
      e.preventDefault();
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  const inputProps = {
    ref: inputRef,
    value: tempValue,
    onChange: (e: any) => setTempValue(e.target.value),
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    autoFocus: true,
  };

  return (
    <div 
      className={`relative group/editable cursor-text rounded-sm transition-all ${!isEditing ? 'hover:bg-brand-main/5 hover:ring-1 hover:ring-brand-main/20' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      {children(isEditing, inputProps)}
    </div>
  );
};