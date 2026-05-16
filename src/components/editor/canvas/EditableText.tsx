"use client";

import React, { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  tagName?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  placeholder?: string;
}

export const EditableText = ({ 
  value, 
  onSave, 
  className = "", 
  tagName: Tag = 'span',
  placeholder = "הקלד טקסט..." 
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // סנכרון אם הערך משתנה מבחוץ (למשל מהסיידבר)
  useEffect(() => {
    setText(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== value) {
      onSave(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setText(value); // ביטול שינויים
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const commonProps = {
      ref: inputRef as any,
      value: text,
      onChange: (e: any) => setText(e.target.value),
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      autoFocus: true,
      className: `${className} outline-none ring-2 ring-brand-main/50 bg-brand-main/5 rounded-sm w-full resize-none overflow-hidden`,
      placeholder: placeholder,
    };

    // אם זה טקסט ארוך (P או DIV), נשתמש ב-Textarea
    return (Tag === 'p' || Tag === 'div') ? (
      <textarea {...commonProps} rows={Math.max(1, text.split('\n').length)} />
    ) : (
      <input {...commonProps} type="text" />
    );
  }

  return (
    <Tag 
      className={`${className} cursor-text hover:bg-brand-main/5 hover:ring-1 hover:ring-brand-main/20 transition-all rounded-sm`}
      onClick={(e) => {
        e.stopPropagation(); // מונע בחירה של כל הסקשן בלחיצה על הטקסט
        setIsEditing(true);
      }}
    >
      {value || <span className="opacity-30 italic">{placeholder}</span>}
    </Tag>
  );
};