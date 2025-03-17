import { Link } from "react-router-dom";
import ManageUsers from "./ManageUsers.jsx";
import CreateAccount from './CreateAccount.jsx';

function AdminLandingPage(){
    return(
        <div className="main-container">
            <Link to="/admin/message"><AdminRole name="&#9993;" id="message"/></Link>
            <Link to="/admin/cook-mode"><AdminRole name="Cook Mode" id="cook-mode"/></Link>
            <Link to="/admin/ratio-and-sizes"><AdminRole name="Ratio and Sizes" id="ratio-sizes"/></Link>
            <Link to="/admin/add-new-meal"><AdminRole name="Add New Meal/Update" id="add-meal"/></Link>
            <Link to="/create-account"><AdminRole name="Add Cook/Staff" id="add-cook"/></Link>
            <Link to="/admin/visitors"><AdminRole name="Alert Cook About Visitor" id="alert-cook"/></Link>
            <Link to="/admin/mngUsers"><AdminRole name="Manage Users"/></Link>
        </div>
    );
}

function AdminRole(props){
    return(
            <div className="items " id={props.id}>
                <p className="content">{props.name}</p>
            </div>
    );
}

export default AdminLandingPage