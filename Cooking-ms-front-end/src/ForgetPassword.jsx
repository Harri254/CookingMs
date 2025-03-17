function ForgetPassword() {
    return (
      <div className="fp-form-div">
        <h2>Reset Your Password</h2>
        <form>
          <div className="email-wrap">
            <label htmlFor="email">Enter Your Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <br />
          <div className="fp-btn">
            <button type="submit">Send Reset Link</button>
          </div>
          
        </form>
      </div>
    );
  }
  
  export default ForgetPassword;
  