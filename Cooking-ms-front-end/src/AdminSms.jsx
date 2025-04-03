import './AdminSms.css'

function Message(){
    return (
        <div className="admin-sms">
            <label htmlFor="admin-sms">Hello!</label>
            <textarea name="admin-sms" id="admin-sms" cols="30" rows="10"></textarea>
            <div className="sms-controls">
                <button>Noted</button><button>On It Now</button>
            </div>
        </div>
    );
}
export default Message;