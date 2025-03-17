function RatiosAndSizes(){
    return(
        <div className="rs-container">
            <input type="search" name="search-rs" id="search-rs" placeholder="Search Meal Type" />
            <h4>Meals Available : </h4>
            <hr />
            <div className="container-for-wrap">
                <FieldComponent foodType="Beans and Rice" />
                <FieldComponent foodType="Meat and Rice" />
                <FieldComponent foodType="Beans and Maize" />
                <FieldComponent foodType="Ndeng'u and Rice" />
                <FieldComponent foodType="Beans and Ugali" />
                <FieldComponent foodType="Ndeng'u and Rice" />
            </div>
            <h4>Size of Amount</h4>
            <hr />
            <div className="container-for-wrap">
                <FieldComponent2 name="Students"/>
                <FieldComponent2 name="Teachers"/>
            </div>
            
            <h4>School Population</h4>
            <hr />
            <SchoolPopulation/>

        </div>
    );
}
function FieldComponent(props){
    let foodTypes = props.foodType;
    let capitalWords = foodTypes.match(/\b[A-Z][a-z]*/g);
  return(
    <>
        <fieldset className="food-type">
            <legend>{foodTypes}</legend>
            <div>
                {capitalWords.map((word, index) => (
                    <div key={index}>
                        <label htmlFor={`food${index}`}>{word}</label>
                        <input type="number" name={`food${word}`} id={`food${word}`} />
                        
                    </div>
                ))}
            </div>
            <div className="fc-btns">
                <button>Update Resume</button>
                <button>Delete Meal</button>
            </div>
         </fieldset>
         
    </>
  );
}
function FieldComponent2(props){
    return(
        <div className="sizes-of-amount">
            <fieldset>
                <legend>{props.name}</legend>
                <div>
                    <p><label htmlFor="quantity">Qty </label>
                    <input type="number" name="quantity" id="quantity" /> 
                    <span> for </span>
                    <input type="number" name="ppl-number" id="ppl-number" />
                    <label htmlFor="ppl-number"> {props.name}</label>
                    </p>
                </div>
                <div className="fc2-btns">
                    <button>Reset Default</button>
                    <button>Save Changes</button>
                </div>
            </fieldset>
            
            
        </div>
    );
}
function SchoolPopulation(){
    return(
            <div className="std-population">
                <div>
                    <p>Student Count in Total: </p>
                    <div className="inputing-changed-value">
                        <input type="number" className="" />
                        <input type="submit" value="Save" />
                    </div>
                </div>
                <div>
                    <p>Teachers Count in Total: </p>
                    <div className="inputing-changed-value">
                        <input type="number" className="" />
                        <input type="submit" value="Save" />
                    </div>
                </div>
            </div>
    );
}
export default RatiosAndSizes