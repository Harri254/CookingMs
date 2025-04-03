import InputSample from "./InputSample";
import './Visitors.css';

function Visitors(){
    return(
        <div className="vs-container">
            <h4>Have Visitors? Alert the Cook</h4>
            <hr />
            <form action="" className="vs-form">
                <InputSample label="Number of Visitors" type="number"/>
                
                <InputSample label="food to Be Prepared" type="text"/>
                
                <InputSample label="fruit or Drink" type="text"/>
                
                <div className="text-ar" >
                    <label htmlFor="vs-message">Enter command Message</label>
                    <textarea name="vs-message" id="vs-message" cols="30" rows="10"></textarea>
                </div>
                
                <input type="submit" value="Send" id="vs-submit" />
            </form>
            
        </div>
    );
}

export default Visitors
