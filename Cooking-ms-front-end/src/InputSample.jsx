function InputSample({ label, type, value, onChange, min, max, placeholder }) {
    // Capitalize the first letter of the label
    const cap = label ? label.charAt(0).toUpperCase() + label.slice(1) : "";
  
    // Generate a unique ID for the input field
    const inputId = `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  
    return (
      <div className="input-div">
        {/* Label */}
        <label htmlFor={inputId}>Enter {cap}: </label>
  
        {/* Input Field */}
        <input
          type={type}
          id={inputId}
          name={label}
          value={value || ""}
          onChange={onChange}
          min={min || undefined}
          max={max || undefined}
          placeholder={placeholder || `Enter ${cap}`}
        />
      </div>
    );
  }
  
  export default InputSample;