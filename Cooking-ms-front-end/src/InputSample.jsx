function InputSample(props){
    const cap = props.label.charAt(0).toUpperCase()+props.label.slice(1);
    return(
        <div className="input-div">
            <label htmlFor={props.label}>Enter {cap} : </label>
            <input type={props.type} name={props.label} id={props.label}/>
        </div>
    );
}
export default InputSample