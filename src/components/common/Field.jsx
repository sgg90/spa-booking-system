import React from "react";

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-ink-700">
      {children}
    </label>
  );
}

export function ErrorText({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-terracotta-600">{children}</p>;
}

const baseInput =
  "focus-ring w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink-700 placeholder:text-ink-300";

export function TextField({ label, error, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <input
        className={`${baseInput} ${error ? "border-terracotta-400" : "border-sand-200 focus-visible:border-sage-400"}`}
        {...props}
      />
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

export function TextAreaField({ label, error, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <textarea
        className={`${baseInput} min-h-[110px] resize-y ${
          error ? "border-terracotta-400" : "border-sand-200 focus-visible:border-sage-400"
        }`}
        {...props}
      />
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

export function SelectField({ label, error, children, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <select
        className={`${baseInput} ${error ? "border-terracotta-400" : "border-sand-200 focus-visible:border-sage-400"}`}
        {...props}
      >
        {children}
      </select>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

export function CheckboxGroup({ label, help, options, seleccionados, onChange, error }) {
  function toggle(id) {
    if (seleccionados.includes(id)) {
      onChange(seleccionados.filter((v) => v !== id));
    } else {
      onChange([...seleccionados, id]);
    }
  }
  return (
    <div>
      {label && <Label>{label}</Label>}
      {help && <p className="mb-2 -mt-0.5 text-xs text-ink-500">{help}</p>}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((opt) => (
          <label
            key={opt.id}
            className="focus-ring flex cursor-pointer items-center gap-2 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm text-ink-700 hover:border-sage-300"
          >
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-sand-300 text-sage-600 focus:ring-sage-400"
              checked={seleccionados.includes(opt.id)}
              onChange={() => toggle(opt.id)}
            />
            {opt.nombre}
          </label>
        ))}
      </div>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}
